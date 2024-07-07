"use client";

import { apiAll } from "@/app/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useSale } from "./useSale";
import { useRouter } from "next/navigation";
export const useDeleteSale = (id: number) => {
  const router = useRouter();
  const { refetch } = useSale();
  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      const responseDelete = await apiAll.delete(`sale/${id}`);
      console.log("delete response:", responseDelete);
    },

    onSuccess: () => {
      refetch();
      window.location.href = "/";
      console.log("success");
    },
  });
  return { mutate };
};
