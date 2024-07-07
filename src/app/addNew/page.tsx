"use client";
import { FromRowType, IProduct } from "@/types";
import { useState, useEffect } from "react";
import { UseProduct } from "../fetures/useProduct";
import { FormInput } from "@/components/FormInput";
import { useValidate } from "../fetures/useValidate";
import { useMutation } from "@tanstack/react-query";
import { apiAll } from "../lib/axios";
import AlertInfo from "@/components/AlertInfo";
import { useRouter } from "next/navigation";

const AddNewPage = () => {
  const router = useRouter();
  const { data } = UseProduct();
  const { control, handleSubmit, errors, reset } = useValidate();
  const [alert, setAlert] = useState({ visible: false, message: "", type: "" });
  const [row, setRow] = useState<FromRowType[]>([
    { name: "", price: 0, qty: 0, total: 0, product_id: 0 },
  ]);
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    total_price: 0,
  });
  const [taxRate, setTaxRate] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);

  const handleAddRow = () => {
    setRow([...row, { name: "", price: 0, qty: 0, total: 0, product_id: 0 }]);
  };

  const handleChange = (
    index: number,
    field: keyof FromRowType,
    value: string | number
  ) => {
    const newRows = [...row];
    if (field === "price" || field === "qty") {
      value = Number(value);
      newRows[index][field] = value;
      newRows[index].total = newRows[index].price! * newRows[index].qty!;
    }

    setRow(newRows);
  };

  const handleSelectProduct = (index: number, id: number) => {
    const newRows = [...row];
    const existProduct = data.data?.find((item: IProduct) => item.id === id);

    newRows[index].name = existProduct?.name;
    newRows[index].price = existProduct?.price;
    newRows[index].product_id = existProduct.id;
    newRows[index].total = newRows[index].price! * newRows[index].qty!;

    setRow(newRows);
    console.log("id", newRows);
  };

  useEffect(() => {
    calculate();
  }, [row, taxRate, discountRate]);

  const calculate = () => {
    const subtotal = row.reduce((acc, item) => acc + item.total!, 0);
    const tax = subtotal * (taxRate / 100);
    const discount = subtotal * (discountRate / 100);
    const total_price = subtotal - discount + tax;
    setTotals({
      subtotal,
      tax,
      discount,
      total_price,
    });
  };

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const response = await apiAll.post("sale", data);
      console.log("res", response);
    },
    onSuccess: () => {
      setAlert({ visible: true, message: "Success", type: "success" });
      router.replace("/");
    },
  });

  const onSubmit = (formData: any) => {
    const payload = {
      ...formData,
      subtotal: totals.subtotal,
      tax: taxRate + "%",
      discount: discountRate + "%",
      total_price: totals.total_price,
      detail: row?.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.qty,
        price: item.price,
      })),
    };
    mutate(payload);
  };

  const handleReset = () => {
    reset();
    setRow([{ name: "", price: 0, qty: 0, total: 0, product_id: 0 }]);
    setTaxRate(0); // Reset to no value
    setDiscountRate(0); // Reset to no value
    setTotals({
      subtotal: 0,
      tax: 0,
      discount: 0,
      total_price: 0,
    });
  };

  return (
    <main>
      <div className="max-w-screen-xl max-h-screen mx-auto mt-6 px-4">
        {alert.visible && (
          <AlertInfo
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, visible: false })}
          />
        )}
        <div className="px-4 py-2 border border-slate-200 rounded-md mt-2">
          <h1 className="text-xl font-bold my-4">Add New</h1>
          <form>
            <div className="grid gap-6 mb-6 md:grid-cols-1">
              <FormInput
                label="Invoice"
                name="invoice_id"
                type="text"
                control={control}
                placeholder="Invoice...."
                errors={errors}
              />
              <FormInput
                label="Date"
                name="transaction_date"
                control={control}
                type="date"
                errors={errors}
              />
              <FormInput
                label="Customer"
                name="customer_name"
                placeholder="Customer...."
                control={control}
                type="text"
                errors={errors}
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
                    {row.map((item: FromRowType, index: number) => (
                      <tr key={index} className="dark:bg-gray-800">
                        <td
                          scope="row"
                          className="font-medium text-gray-900 whitespace-nowrap dark:text-white px-3">
                          <select
                            id="product"
                            name="product"
                            value={
                              data?.data?.find((p) => p.name === item.name)?.id
                            }
                            onChange={(e) =>
                              handleSelectProduct(index, Number(e.target.value))
                            }
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="">Choose product</option>
                            {data?.data?.map((item: IProduct) => (
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
                            value={item.price}
                            onChange={(e) =>
                              handleChange(index, "price", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-4 py-4">
                          <input
                            type="number"
                            id="Qty"
                            name="qty"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Qty"
                            value={item.qty}
                            required
                            min={0}
                            onChange={(e) =>
                              handleChange(index, "qty", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-4 py-4">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button
                  className="mt-3 w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={handleAddRow}
                  type="button">
                  Add Row
                </button>
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
            <div className="flex justify-between">
              <button
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={handleReset}
                type="button">
                Reset
              </button>

              <button
                className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={handleSubmit(onSubmit)}
                type="button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddNewPage;
