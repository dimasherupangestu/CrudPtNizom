"use client";

import { useQuery } from "@tanstack/react-query";
import { apiAll } from "../lib/axios";

export const UseProduct = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const response = await apiAll.get("product");
      console.log("API Response", response.data); // Tambahkan log ini
      return response.data;
    },
  });

  return { data, isLoading, refetch };
};
