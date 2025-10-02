import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    code?: string;
    error?: string;
  };
};

/**
 * Main callback handler for OAuth flows
 * This page redirects to the appropriate callback handler based on parameters
 */
export default function CallbackPage({ searchParams }: Props) {
  // If we have a code parameter, assume it's an Instagram auth code
  if (searchParams.code) {
    // Redirect to the Instagram callback handler with the code
    redirect(`/callback/instagram?code=${searchParams.code}`);
  }

  // If there's an error, log it and redirect to the dashboard
  if (searchParams.error) {
    console.error("OAuth Error:", searchParams.error);
    redirect("/dashboard?error=oauth_failed");
  }

  // Default fallback - redirect to dashboard
  redirect("/dashboard");
}
