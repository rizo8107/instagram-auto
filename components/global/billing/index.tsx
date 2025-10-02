"use client";

import { useQueryUser } from "@/hooks/user-queries";
import PaymentCard from "./payment-card";

type Props = {};

function Billing({}: Props) {
  const { data } = useQueryUser();

  return (
    <div className="flex lg:flex-row flex-col gap-5 w-full lg:w-10/12 xl:w-8/12 container">
      <PaymentCard label="PRO" current={data?.data?.subscription?.plan!} />
      <PaymentCard label="FREE" current={data?.data?.subscription?.plan!} />
    </div>
  );
}

export default Billing;
