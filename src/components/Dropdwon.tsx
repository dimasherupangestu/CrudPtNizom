import React from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { apiAll } from "@/app/lib/axios";
import { useDeleteSale } from "@/app/fetures/useDelete";

interface DropdownProps {
  isOpen: boolean;
  closeDropdown: () => void;
  id: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  isOpen,
  closeDropdown,
  id,
}) => {
  const { mutate } = useDeleteSale(id);
  const confrimDelete = (id: number) => {
    const confirmation = confirm("Are you sure you want to delete?");
    if (confirmation) {
      mutate(Number(id));
    }
  };
  return (
    <div
      className={`z-10 ${isOpen ? "block" : "hidden"} text-white bg-gray-600 divide-y divide-gray-100 rounded-lg shadow w-44 light:bg-white absolute`}>
      <ul
        className="py-2 text-sm text-white dark:text-gray-200 border-b border-slate-300"
        aria-labelledby="dropdownMenuIconButton">
        <li>
          <Link
            href={`/edit/${id}`}
            className="block px-4 py-2 hover:bg-gray-100 text-yellow-500  dark:hover:bg-gray-600 dark:hover:text-gray-700">
            Edit
          </Link>
        </li>
        <li>
          <Link
            href={`/detail/${id}`}
            className="block px-4 py-2 hover:bg-gray-100 text-blue-500  dark:hover:bg-gray-600 dark:hover:text-gray-700">
            Detail
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={() => confrimDelete(id)}
            className="w-full ml-auto px-4 py-2 text-start hover:bg-gray-100 text-red-500 ">
            Hapus
          </button>
        </li>
      </ul>
    </div>
  );
};
