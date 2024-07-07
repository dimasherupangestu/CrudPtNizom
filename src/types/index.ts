import { Control, FieldErrors, FieldValues } from "react-hook-form";

export interface FromRowType {
  id?: number;
  name?: string;
  price?: number;
  qty?: number;
  quantity?: number;
  total?: number;
  product_id: number;
}

export interface ITable {
  id: number;
  transaction_date?: string;
  invoice_id: number;
  customer_name: string;
  total_price: number;
  subtotal?: number;
}
export interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
}

export interface ISale {
  transaction_date: string;
  invoice_id: string;
  customer_name: string;
  subtotal?: number;

  tax?: string;
  discount?: string;
  total_price?: number;
}
export interface FormInputProps {
  control: Control<FieldValues | any>;
  errors?: FieldErrors<FieldValues>;
  name: keyof ISale;
  label?: string;
  type: string;
  placeholder?: string;
  props?: any;
  subtotal?: number;
  tax?: number;
  readOnly?: boolean;
  discount?: number;
  total_price?: number;
}

export interface IAlert {
  message: string;
  onClose: () => void;
  type: string;
}
