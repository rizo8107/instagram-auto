import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SimplePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-bg p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
              li
            </div>
            <span className="text-xl font-semibold text-blue-200">Slide</span>
          </div>
          <Link href="/dashboard">
            <Button className="bg-white text-black px-7 font-semibold">
              Login
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-4xl font-bold text-white md:text-6xl">
            Instagram Automation Platform
          </h1>
          <p className="mt-6 text-xl text-blue-200 max-w-2xl mx-auto">
            Streamline your communication and connect with your audience effortlessly.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">Feature {i}</h3>
              <p className="text-blue-200">
                A simplified landing page to test rendering without external resources.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
