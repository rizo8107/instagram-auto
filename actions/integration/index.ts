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
      const token = await generateToken(code);
      console.log("🚀 ~ onIntegrate ~ token:", token);

      if (token) {
        const insts_id = await axios.get(
          `${process.env.INSTAGRAM_BASE_URL}/me?fields=user_id&access_token=${token.access_token}`
        );

        const today = new Date();
        const expire_date = today.setDate(today.getDate() + 60);
        const create = await createIntegration(
          user.id,
          token.access_token,
          new Date(expire_date),
          insts_id.data.user_id
        );
        return { status: 200, data: create };
      }
      return { status: 401, error: "Failed to generate token" };
    }

    return { status: 404, error: "Integration already exists" };
  } catch (error: any) {
    console.error("Integration error:", error);
    return { 
      status: 500, 
      error: error.message || "Unknown integration error" 
    };
  }
};
