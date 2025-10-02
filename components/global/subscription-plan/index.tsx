import { useQueryUser } from "@/hooks/user-queries";
import React from "react";

type Props = {
  type: "FREE" | "PRO";
  children: React.ReactNode;
};

function SubscriptionPlan({ type, children }: Props) {
  const { data } = useQueryUser();
  return data?.data?.subscription?.plan === type && children;
}

export default SubscriptionPlan;
