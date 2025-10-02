import axios from "axios";

export const refreshToken = async (token: string) => {
  const refresh_token = await axios.get(
    `${process.env.INSTAGRAM_BASE_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
  );
  return refresh_token.data;
};

export const sendDm = async (
  userId: string,
  receiverId: string,
  prompt: string,
  token: string
) => {
  console.log("sending Message");
  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/v21.0/${userId}/messages`,
    {
      recipient: {
        id: receiverId,
      },
      message: {
        text: prompt,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const sendPrivateMessage = async (
  userId: string,
  receiverId: string,
  prompt: string,
  token: string
) => {
  console.log("sending Message");
  return await axios.post(
    `${process.env.INSTAGRAM_BASE_URL}/${userId}/messages`,
    {
      recipient: {
        comment_id: receiverId,
      },
      message: {
        text: prompt,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const generateToken = async (code: string) => {
  const insta_form = new FormData();
  insta_form.append("client_id", process.env.INSTAGRAM_CLIENT_ID as string);

  insta_form.append(
    "client_secret",
    process.env.INSTAGRAM_CLIENT_SECRET as string
  );
  insta_form.append("grant_type", "authorization_code");
  insta_form.append(
    "redirect_uri",
    `${process.env.NEXT_PUBLIC_HOST_URL}/callback/instagram`
  );
  insta_form.append("code", code);

  const shortTokenRes = await fetch(process.env.INSTAGRAM_TOKEN_URL as string, {
    method: "POST",
    body: insta_form,
  });

  const token = await shortTokenRes.json();
  // Expect token to contain access_token when successful
  if (!token || !token.access_token) {
    console.error("generateToken: No access_token in response", token);
    return null;
  }

  console.log("generateToken: short-lived token acquired");

  try {
    // Try to exchange for a long-lived token using Graph API parameter fb_exchange_token
    const longTokenRes = await axios.get(
      `${process.env.INSTAGRAM_BASE_URL}/oauth/access_token`,
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: process.env.INSTAGRAM_CLIENT_ID,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
          fb_exchange_token: token.access_token,
        },
      }
    );

    return longTokenRes.data || token;
  } catch (exchangeErr) {
    console.warn("generateToken: long-lived exchange failed, falling back to short token", exchangeErr);
    return token;
  }
};
