"use client";

import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/use-subscription";
import { CreditCardIcon, Loader2 } from "lucide-react";

type Props = {};

function PaymentButton({}: Props) {
  const { isProcessing, onSubscription } = useSubscription();

  return (
    <Button
      disabled={isProcessing}
      onClick={onSubscription}
      className="bg-gradient-to-br text-white rounded-full from-[#6d60a3] via-[#9434E6] font-bold to-[#CC3BD4]"
    >
      {isProcessing ? <Loader2 className="animate-spin" /> : <CreditCardIcon />}
      Upgrade
    </Button>
  );
}

export default PaymentButton;
PaymentButton;
