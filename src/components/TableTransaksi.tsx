"use client";

import { ITable } from "@/types";
import React, { useState } from "react";
import Link from "next/link";
import { BsFillFilterSquareFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { useSale } from "@/app/fetures/useSale";
import { Dropdown } from "./Dropdwon";
import { IoSettings } from "react-icons/io5";
import { Loding } from "./Loding";

export const TableTransaksi = () => {
  const [page, setPage] = useState(1);
  const [openSet, setOpenSet] = useState<null | number>(null);
  const [sort, setSort] = useState("");
  const [order, setOrder] = useState("");
  const limit = 10;
  const [search, setSearch] = useState("");
  const { data, isLoading, totalPage, currentPage, refetch } = useSale({
    search,
    limit,
    offset: (page - 1) * limit,
    page,
    sort,
    order,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1); // Reset halaman ke 1 setiap kali ada pencarian baru
    refetch();
  };

  const nextPage = () => {
    if (page < totalPage) {
      setPage(page + 1);
      refetch();
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      refetch();
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [newSort, newOrder] = value.split("|"); // Memisahkan sort dan order dari nilai select
    setSort(newSort); // Set nilai sort
    setOrder(newOrder); // Set nilai order
    refetch(); // Lakukan refetch data
  };
  const toggleDropdown = (index: number) => {
    if (openSet === index) {
      setOpenSet(null);
    } else {
      setOpenSet(index);
    }
  };
  return (
    <div>
      {!isLoading ? (
        <div>
          <div className="w-full flex justify-between items-center">
            <form onSubmit={handleSearch}>
              <select
                id="sort"
                name="sort"
                value={`${sort}|${order}`} // Menggunakan nilai sort dan order dalam value select
                onChange={handleSortChange} // Menangani perubahan sort
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value={sort}>
                  <span className="text-md">📅</span>
                </option>
                <option value={"ASC"}>ASC</option>
                <option value={"DESC"}>DESC</option>
              </select>
            </form>

            <div className="flex justify-center items-center gap-4">
              <div>
                <form onSubmit={handleSearch} className="max-w-md mx-auto">
                  <label
                    htmlFor="default-search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <FaSearch />
                    </div>
                    <input
                      type="search"
                      name="search"
                      id="default-search"
                      className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="border border-slate-400 p-1 rounded-sm flex items-center">
                <BsFillFilterSquareFill size={30} />
              </div>
              <div className="">
                <Link href={"addNew"}>
                  <button
                    type="button"
                    className="text-blue-500 flex justify-center items-center hover:text-white border border-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800">
                    <span className="mr-2">
                      <IoMdAdd size={19} />
                    </span>
                    ADD NEW
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      No Invoice
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Qty
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total Harga
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                {data?.data?.map((item: ITable, index: number) => (
                  <tbody key={index}>
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {item.transaction_date?.split("T")[0]}
                      </th>
                      <td className="px-6 py-4">{item.invoice_id}</td>
                      <td className="px-6 py-4">{item.customer_name}</td>
                      <td className="px-6 py-4">{item.total_price}</td>
                      <td className="px-6 py-4">{item.subtotal}</td>
                      <td className="px-6 py-4">
                        <div>
                          <button
                            onClick={() => toggleDropdown(index)}
                            id="dropdownMenuIconButton"
                            data-dropdown-toggle="dropdownDots"
                            className="inline-flex items-center p-2 text-sm font-medium text-center text-white bg-gray-800 rounded-lg focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            type="button">
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 4 15">
                              <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                            </svg>
                          </button>
                          <Dropdown
                            isOpen={openSet === index}
                            closeDropdown={() => setOpenSet(null)}
                            id={item.id}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={prevPage}
                  className="px-4 py-2 text-white bg-blue-600 rounded">
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPage}
                </span>
                <button
                  onClick={nextPage}
                  className="px-4 py-2 text-white bg-blue-600 rounded">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loding />
      )}
    </div>
  );
};
