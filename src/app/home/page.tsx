import React from "react";
import Link from "next/link";
import { BsFillFilterSquareFill, BsMenuUp } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { TableTransaksi } from "@/components/TableTransaksi";

const HomePage = () => {
  const FetchTransaksi = () => {};
  return (
    <div className="max-w-screen-xl max-h-screen mx-auto mt-6">
      <h1 className="font-bold text-xl ">Daftar Transaksi</h1>

      <TableTransaksi />
    </div>
  );
};

export default HomePage;
