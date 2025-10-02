import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SimplePage() {
  return (
    <div className="flex flex-col gap-y-10 p-8">
      <h1 className="text-4xl font-bold">Dashboard Works!</h1>
      <p className="text-lg">This is a simplified page to test dashboard rendering.</p>
      <Button variant="outline">Test Button</Button>
    </div>
  );
}
