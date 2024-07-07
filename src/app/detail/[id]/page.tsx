"use client";
import { UseProduct } from "@/app/fetures/useProduct";
import { useValidate } from "@/app/fetures/useValidate";
import { apiAll } from "@/app/lib/axios";
import AlertInfo from "@/components/AlertInfo";
import { FormInput } from "@/components/FormInput";
import { FromRowType, IProduct } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Loding } from "@/components/Loding";

const DetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { control, errors, reset } = useValidate(); // Menggunakan useValidate untuk kontrol validasi

  const { data: product } = UseProduct();

  const [row, setRow] = useState<FromRowType[]>([
    { name: "", price: 0, quantity: 0, total: 0, product_id: 0 },
  ]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

  const { data: productById, isLoading } = useQuery({
    queryKey: ["productId"],
    queryFn: async () => {
      const responseById = await apiAll.get(`sale/${id}`);
      console.log("res", responseById.data.data);
      setRow(responseById.data.data.detail);
      const date = dayjs(responseById.data.data.transaction_date).format(
        "YYYY-MM-DD"
      );
      reset({
        ...responseById.data.data,
        transaction_date: date,
      });
      setTaxRate(+responseById.data.data.tax.replace("%", "")); // Initialize tax rate
      setDiscountRate(+responseById.data.data.discount.replace("%", "")); // Initialize discount rate
      return responseById.data.data;
    },
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total_price: 0,
  });

  const handleSelectProduct = (index: number, id: number) => {
    const newRows = [...row];
    const existProduct = product?.data?.find(
      (item: IProduct) => item.id === id
    );
    newRows[index].name = existProduct?.name;
    newRows[index].price = existProduct?.price;
    newRows[index].id = existProduct.id;
    newRows[index].quantity = 1;
    newRows[index].total = newRows[index].price! * newRows[index].quantity!;

    setRow(newRows);
  };

  useEffect(() => {
    calculate();
  }, [row, taxRate, discountRate]);

  const calculate = () => {
    const subtotal = row.reduce((acc, item) => acc + item.total!, 0);
    const tax = subtotal * (taxRate / 100); // updated
    const discount = subtotal * (discountRate / 100); // updated
    const total_price = subtotal - discount + tax;
    setTotals({
      subtotal,
      tax,
      discount,
      total_price,
    });
  };

  console.log("row", row);

  return (
    <main>
      {!isLoading ? (
        <div className="max-w-screen-xl max-h-screen mx-auto mt-6 px-4">
          <div className="px-4 py-2 border border-slate-200 rounded-md mt-2">
            <h1 className="text-xl font-bold my-4">Detail Sale News</h1>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-white bg-slate-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Back
              </button>
            </div>
            <form>
              <div className="grid gap-6 mb-6 md:grid-cols-1">
                <FormInput
                  label="Invoice"
                  name="invoice_id"
                  type="text"
                  control={control}
                  placeholder="Invoice...."
                  errors={errors}
                  readOnly
                />
                <FormInput
                  label="Date"
                  name="transaction_date"
                  control={control}
                  type="date"
                  placeholder="date"
                  errors={errors}
                  readOnly
                />
                <FormInput
                  label="Customer"
                  name="customer_name"
                  placeholder="Customer...."
                  control={control}
                  type="text"
                  errors={errors}
                  readOnly
                />
              </div>
              <div className="mt-6 mb-2">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 border-b-2 border-slate-300">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Qty
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {row?.map((item: FromRowType, index: number) => (
                        <tr key={index} className="dark:bg-gray-800">
                          <td
                            scope="row"
                            className="font-medium text-gray-900 whitespace-nowrap dark:text-white px-3">
                            <select
                              id="product"
                              name="product"
                              value={item.product_id}
                              onChange={(e) =>
                                handleSelectProduct(
                                  index,
                                  Number(e.target.value)
                                )
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                              {product?.data?.map!((item: IProduct) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              )) || <option>No Products Available</option>}
                            </select>
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              name="price"
                              id="price"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Price..."
                              required
                              min={0}
                              readOnly
                              value={item.price}
                            />
                          </td>
                          <td className="px-4 py-4">
                            <input
                              type="number"
                              id="quantity"
                              name="quantity"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="Qty"
                              required
                              min={0}
                              readOnly
                              value={item.quantity}
                            />
                          </td>
                          <td className="px-4 py-4">
                            {(item.total = item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3 w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"></div>
                </div>
              </div>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="taxRate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    id="taxRate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Tax Rate"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    required
                    min={0}
                    readOnly
                  />
                </div>
                <div>
                  <label
                    htmlFor="discountRate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Discount Rate (%)
                  </label>
                  <input
                    type="number"
                    id="discountRate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Discount Rate"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    min={0}
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-6 mb-6">
                <h2 className="text-lg font-semibold">Summary</h2>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>{totals.subtotal}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax ({taxRate}%):</span>
                    <span>{totals.tax}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Discount ({discountRate}%):</span>
                    <span>{totals.discount}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Price:</span>
                    <span>{totals.total_price}</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Loding />
      )}
    </main>
  );
};

export default DetailPage;
