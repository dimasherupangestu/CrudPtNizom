import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as zod from "zod";

export const useValidate = () => {
  const validationSchema = zod.object({
    transaction_date: zod.string().nonempty("transaction date is required"),

    invoice_id: zod.string().min(3, "Invoice 3 characters minimum"),
    customer_name: zod.string().min(3, "Customer name 3 characters minimum"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    mode: "all",
  });

  return { control, handleSubmit, errors, reset };
};
