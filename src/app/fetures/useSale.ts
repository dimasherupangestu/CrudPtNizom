import { useQuery } from "@tanstack/react-query";
import { apiAll } from "../lib/axios";
import { Props } from "@/types";

export const useSale = ({
  search = "",
  limit = 10,
  offset = 0,
  page = 1,
  sort = "",
  order = "",
}: Props = {}) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["saleLimit", page, limit, search, sort, order],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (limit) params.append("limit", limit.toString());
      if (offset) params.append("offset", offset.toString());
      if (page) params.append("page", page.toString());
      if (sort) params.append("sort", sort);
      if (order) params.append("order", order);

      const response = await apiAll.get(`sale?${params.toString()}`);
      console.log(response.data);
      return response.data;
    },
  });

  return {
    data,
    isLoading,
    totalPage: data?.total_page,
    currentPage: data?.current_page,
    refetch,
  };
};
