"use server";

import { generateToken } from "@/lib/fetch";
import axios from "axios";
import { redirect } from "next/navigation";
import { onCurrentUser } from "../user";
import { createIntegration, getIntegrations } from "./queries";

export const onOathInstagram = async (strategy: "INSTAGRAM" | "CRM") => {
  if (strategy === "INSTAGRAM") {
    // If a full auth URL is provided via env, use it directly
    const full = process.env.INSTAGRAM_AUTH_FULL_URL;
    if (full && full.length > 0) {
      console.log("Redirecting to Instagram FULL auth URL from env");
      return redirect(full);
    }

    // Fallback: construct the Instagram OAuth URL with basic scopes
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`;
    const scope = 'user_profile,user_media';

    const instagramAuthUrl = `${process.env.INSTAGRAM_EMBEDDED_OAUTH_URL}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

    console.log("Redirecting to Instagram auth URL:", instagramAuthUrl);
    return redirect(instagramAuthUrl);
  }
};

export const onIntegrate = async (code: string) => {
  try {
    const user = await onCurrentUser();

    const integration = await getIntegrations(user.id);

    if (integration && integration.integrations.length === 0) {
      // BYPASS: if a debug access token is provided, use it directly once
      const debugToken = process.env.INSTAGRAM_DEBUG_ACCESS_TOKEN;
      if (debugToken && debugToken.length > 0) {
        try {
          const meRes = await axios.get(
            `${process.env.INSTAGRAM_BASE_URL}/me`,
            {
              params: {
                fields: "accounts{instagram_business_account}",
                access_token: debugToken,
              },
            }
          );

          const pages = meRes.data?.accounts?.data || [];
          const firstPage = pages.find((p: any) => p.instagram_business_account?.id);
          const igBusinessId = firstPage?.instagram_business_account?.id;

          if (!igBusinessId) {
            console.error("debug bypass: no instagram_business_account on any page", meRes.data);
            return { status: 422, error: "No Instagram Business Account connected (debug token)." };
          }

          const today = new Date();
          const expire_date = today.setDate(today.getDate() + 60);
          const created = await createIntegration(
            user.id,
            debugToken,
            new Date(expire_date),
            igBusinessId
          );

          console.log("debug bypass: integration created");
          return { status: 200, data: created };
        } catch (dbgErr: any) {
          console.error("debug bypass failed", dbgErr?.response?.data || dbgErr?.message || dbgErr);
          // fall through to normal flow
        }
      }

      // 1) Exchange code for access token
      const token = await generateToken(code);
      console.log("onIntegrate: token response", token);

      if (token && token.access_token) {
        try {
          // 2) Get the Instagram Business Account ID through the connected pages
          //    /me?fields=accounts{instagram_business_account}
          const meRes = await axios.get(
            `${process.env.INSTAGRAM_BASE_URL}/me`,
            {
              params: {
                fields: "accounts{instagram_business_account}",
                access_token: token.access_token,
              },
            }
          );

          const pages = meRes.data?.accounts?.data || [];
          const firstPage = pages.find((p: any) => p.instagram_business_account?.id);
          const igBusinessId = firstPage?.instagram_business_account?.id;

          if (!igBusinessId) {
            console.error("onIntegrate: No instagram_business_account found on any page", meRes.data);
            return { status: 422, error: "No Instagram Business Account connected to this Facebook user/page" };
          }

          // 3) Persist integration with a 60 day expiry (long-lived IG token)
          const today = new Date();
          const expire_date = today.setDate(today.getDate() + 60);
          const create = await createIntegration(
            user.id,
            token.access_token,
            new Date(expire_date),
            igBusinessId
          );
          return { status: 200, data: create };
        } catch (bizErr: any) {
          console.error("onIntegrate: Failed to resolve Instagram Business Account ID", bizErr?.response?.data || bizErr?.message || bizErr);
          return { status: 500, error: "Failed to resolve Instagram Business Account. Ensure permissions and pages are connected." };
        }
      }
      return { status: 401, error: "Failed to generate token" };
    }

    return { status: 409, error: "Integration already exists" };
  } catch (error: any) {
    console.error("Integration error:", error);
    return { 
      status: 500, 
      error: error.message || "Unknown integration error" 
    };
  }
};
