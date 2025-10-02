import { UseMutateFunction } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema, z } from "zod";
import { toast } from "sonner";

const useZodForm = (
  schema: ZodSchema,
  mutation: UseMutateFunction,
  defaultValues?: any
) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const onFormSubmit = handleSubmit(async (values) => {
    const words = values.prompt.trim().split(/\s+/);
    const reply = values.reply.trim().split(/\s+/);
    const wordLength = values.prompt.trim() === "" ? 0 : words.length;
    const replyLength = values.reply.trim() === "" ? 0 : reply.length;

    if (wordLength !== 0 && wordLength <= 150) {
      if (replyLength <= 20) {
        mutation({ ...values });
      } else {
        toast("Please enter a reply between 1 and 20 words.");
      }
    } else {
      toast("Please enter a prompt between 1 and 150 words.");
    }
  });

  return {
    register,
    errors,
    onFormSubmit,
    watch,
    reset,
  };
};

export default useZodForm;
