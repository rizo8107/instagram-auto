import { Loader2 } from "lucide-react";

export default function InstagramCallbackLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="flex flex-col items-center p-8 bg-black/30 backdrop-blur-lg rounded-xl border border-white/10">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        <h1 className="mt-6 text-2xl font-semibold text-white">Connecting Instagram</h1>
        <p className="mt-2 text-blue-200">Processing your authorization...</p>
      </div>
    </div>
  );
}
