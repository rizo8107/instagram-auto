import { onIntegrate } from "@/actions/integration";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    code?: string;
    error?: string;
  };
};

/**
 * Instagram OAuth callback handler
 * Receives the authorization code from Instagram and exchanges it for an access token
 */
export default async function InstagramCallbackPage({ searchParams }: Props) {
  // If no code parameter is present, redirect to dashboard with error
  if (!searchParams.code) {
    console.error("No code parameter found in Instagram callback");
    return redirect("/dashboard?error=missing_code");
  }

  try {
    // Clean the code in case it has a fragment
    const cleanCode = searchParams.code.split("#_")[0];
    console.log("Processing Instagram authorization code");

    // Call the integration handler to exchange the code for a token
    const result = await onIntegrate(cleanCode);

    // If successful, redirect to the integrations page
    if (result.status === 200 && result.data) {
      const firstName = result.data.firstname || "user";
      const lastName = result.data.lastname || "";
      return redirect(`/dashboard/${firstName}${lastName}/integrations?success=true`);
    }

    // Handle error case
    console.error("Failed to integrate Instagram:", result);
    return redirect("/dashboard?error=integration_failed");
  } catch (error) {
    console.error("Error processing Instagram callback:", error);
    return redirect("/dashboard?error=callback_error");
  }
}
