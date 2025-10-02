import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public callback route that doesn't require authentication
const isCallbackRoute = createRouteMatcher([
  "/callback",
  "/callback/instagram",
]);

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/payment(.*)",
  // Exclude root /callback endpoints from protection
  "/callback/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip authentication for Instagram callback route
  if (isCallbackRoute(req)) return;

  // Require authentication for protected routes
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
