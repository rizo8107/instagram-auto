import { Loader2 } from "lucide-react";

export default function CallbackLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <h1 className="mt-4 text-xl font-medium">Processing authentication...</h1>
      <p className="mt-2 text-muted-foreground">Please wait while we complete your login</p>
    </div>
  );
}
