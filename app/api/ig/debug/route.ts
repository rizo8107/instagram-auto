import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const token = process.env.INSTAGRAM_DEBUG_ACCESS_TOKEN;
  const base = process.env.INSTAGRAM_BASE_URL || "https://graph.facebook.com";

  if (!token) {
    return NextResponse.json({
      status: 400,
      error: "Missing INSTAGRAM_DEBUG_ACCESS_TOKEN env",
    });
  }

  try {
    const meRes = await axios.get(`${base}/me`, {
      params: {
        fields: "accounts{instagram_business_account,name}",
        access_token: token,
      },
    });

    const pages = meRes.data?.accounts?.data || [];
    const firstPage = pages.find((p: any) => p.instagram_business_account?.id);
    const igBusinessId = firstPage?.instagram_business_account?.id;

    return NextResponse.json({
      status: 200,
      base,
      hasPages: pages.length > 0,
      pages,
      igBusinessId: igBusinessId || null,
      note: igBusinessId
        ? "Instagram Business Account ID resolved successfully"
        : "No instagram_business_account found on any connected Page",
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      error: error?.response?.data || error?.message || String(error),
    });
  }
}
