"use server";

import { refreshToken } from "@/lib/fetch";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { updateIntegration } from "../integration/queries";
import { createUser, findUser, updateSubscription } from "./queries";

export const onCurrentUser = async () => {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  return user;
};

export const onboardUser = async () => {
  try {
    // Get the current user from Clerk
    const user = await onCurrentUser();
    if (!user || !user.id) {
      console.error("No authenticated user found");
      return { 
        status: 401, 
        data: { 
          firstname: "guest", 
          lastname: "user" 
        }
      };
    }

    // Try to find the user in our database
    let found = await findUser(user.id);

    // If user doesn't exist in our database, create it
    if (!found) {
      try {
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        const email = user.emailAddresses && user.emailAddresses.length > 0 
          ? user.emailAddresses[0].emailAddress 
          : `${user.id}@example.com`; // Fallback email if none available
        
        console.log("Creating new user:", user.id);
        
        const created = await createUser(user.id, firstName, lastName, email);
        
        // Return with fallback values in case of missing data
        return { 
          status: 201, 
          data: {
            firstname: created.firstname || firstName || "user",
            lastname: created.lastname || lastName || ""
          } 
        };
      } catch (createError) {
        console.error("Error creating user:", createError);
        // Return fallback to prevent breaking the UI
        return { 
          status: 500, 
          data: { 
            firstname: user.firstName || "user", 
            lastname: user.lastName || "" 
          } 
        };
      }
    }

    // Handle token refresh for existing integrations
    if (found.integrations && found.integrations.length > 0) {
      try {
        const integration = found.integrations[0];
        // Only refresh if expiration date exists and is within 5 days
        if (integration.expiresAt) {
          const today = new Date();
          const timeLeft = integration.expiresAt.getTime() - today.getTime();
          const days = Math.round(timeLeft / (1000 * 3600 * 24));

          if (days < 5) {
            console.log("Refreshing token");
            const refreshResult = await refreshToken(integration.token);
            if (refreshResult && refreshResult.access_token) {
              const expireDate = new Date();
              expireDate.setDate(expireDate.getDate() + 60);
              
              await updateIntegration(
                refreshResult.access_token,
                expireDate,
                integration.id
              );
            }
          }
        }
      } catch (refreshError) {
        // Don't fail the whole function if token refresh fails
        console.error("Error refreshing token:", refreshError);
      }
    }

    // Return user data with fallbacks to prevent null values
    return {
      status: 200,
      data: {
        firstname: found.firstname || user.firstName || "user",
        lastname: found.lastname || user.lastName || "",
      },
    };
  } catch (error: any) {
    console.error("Error in onboardUser:", error);
    // Provide fallback values to prevent UI from breaking
    return { 
      status: 500, 
      data: { 
        firstname: "user", 
        lastname: "" 
      },
      error: error.message 
    };
  }
};

export const onUserInfo = async () => {
  const user = await onCurrentUser();

  try {
    const profile = await findUser(user.id);
    if (profile) return { status: 200, data: profile };

    return { status: 404 };
  } catch (error: any) {
    return { status: 500 };
  }
};

export const onSubscribe = async (session_id: string) => {
  const user = await onCurrentUser();

  try {
    // Check if stripe is initialized
    if (!stripe) {
      console.error('Stripe not initialized');
      return { status: 500, error: 'Stripe not initialized' };
    }
    
    // Retrieve session information
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session) {
      // Update user subscription with customer ID
      const subscript = await updateSubscription(user.id, {
        customerId: session.customer as string,
        plan: "PRO",
      });

      if (subscript) return { status: 200 };

      return { status: 401, message: 'Failed to update subscription' };
    }

    return { status: 404, message: 'Session not found' };
  } catch (error) {
    console.error('Error in onSubscribe:', error);
    return { status: 500, message: 'Server error' };
  }
};
