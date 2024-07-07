import React from "react";
import { Controller } from "react-hook-form";
import { FormInputProps } from "@/types";

export const FormInput: React.FC<FormInputProps> = ({
  control,
  errors,
  name,
  label,
  placeholder,
  type,
  readOnly,
  ...props
}) => (
  <>
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          <label
            htmlFor={name}
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </label>
          <input
            type={type}
            {...props}
            {...field}
            id={name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={placeholder}
            required
            readOnly={readOnly}
          />
          {errors && errors[name] && (
            <p className="text-red-500">{errors[name]?.message as string}</p>
          )}
        </div>
      )}
    />
  </>
);
