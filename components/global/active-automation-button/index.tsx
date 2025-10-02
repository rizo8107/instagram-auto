import { activateAutomation } from "@/actions/automation";
import { Button } from "@/components/ui/button";
import { useMutationData } from "@/hooks/use-mutation-data";
import { useQueryAutomations } from "@/hooks/user-queries";
import { ActiveAutomation } from "@/icons/active-automation";
import { Loader2 } from "lucide-react";

type Props = {
  id: string;
};

function ActiveAutomationButton({ id }: Props) {
  const { data } = useQueryAutomations(id);
  const { isPending, mutate } = useMutationData(
    ["activate"],
    (data: { status: boolean }) => activateAutomation(id, data.status),
    "automation-info"
  );

  return (
    <Button
      disabled={isPending}
      onClick={() => mutate({ status: !data?.data?.active })}
      className="lg:px-10 bg-gradient-to-br hover:opacity-80 text-white rounded-full from-[#3352CC] font-medium to-[#1C2D70] ml-4"
    >
      {/*    <Loader className="animate-spin" state={isPending} />
      <ActiveAutomation /> */}
      {isPending ? <Loader2 className="animate-spin" /> : <ActiveAutomation />}
      <p className="lg:inline hidden">
        {data?.data?.active ? "Deactivate" : "Activate"}
      </p>
    </Button>
  );
}

export default ActiveAutomationButton;
