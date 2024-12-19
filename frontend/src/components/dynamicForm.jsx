import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import SelectInput from "./SelectInput";
import NumberInput from "./NumberInput";
import RichTextEditor from "./RichTextEditor";

const formFields = [
  { type: "text", label: "Product Name", name: "productName", required: true },
  { type: "text", label: "SKU", name: "sku", required: false },
  {
    type: "select",
    label: "Brand",
    name: "brand",
    options: ["Brand 1", "Brand 2", "Brand 3"],
    required: false,
  },
  {
    type: "textarea",
    label: "Short Description",
    name: "shortDescription",
    required: false,
  },
  {
    type: "richtext",
    label: "Long Description",
    name: "longDescription",
    required: true,
  },
];

const categories = ["EV Bikes/Scooters", "Accessories"];

const fixedFields = {
    "EV Bikes/Scooters": [
        { type: "number", label: "Price", name: "price", required: true },
        { type: "number", label: "Discount Price", name: "discount_price", required: false },
        { type: "number", label: "Tax Rate", name: "tax_rate", required: false },
        { type: "number", label: "Stock Quantity", name: "stock_quantity", required: true },
        { type: "text", label: "Stock Status", name: "stock_status", required: false, options: ['In Stock', 'Out of Stock', 'Pre-Order'], default: "In Stock" },
        { type: "number", label: "Low stock Alert", name: "low_stock_alert_threshold", required: false },
    ],
    Accessories: [
        { type: "number", label: "Price", name: "price", required: true, },
        { type: "number", label: "Discount Price", name: "discount_price", required: false },
        { type: "number", label: "Tax Rate", name: "tax_rate", required: false },
        { type: "number", label: "Stock Quantity", name: "stock_quantity", required: true },
        { type: "text", label: "Stock Status", name: "stock_status", required: false, options: ['In Stock', 'Out of Stock', 'Pre-Order'], default: "In Stock" },
        { type: "number", label: "Low stock Alert", name: "low_stock_alert_threshold", required: false },
    ],
}

const predefinedSpecifications = {
  "EV Bikes/Scooters": [
    { attribute_name: "Motor Power", attribute_type: "number", required: true },
    {
      attribute_name: "Battery Type",
      attribute_type: "dropdown",
      options: ["Lithium-Ion", "Lead-Acid"],
      required: true,
    },
    {
      attribute_name: "Range Per Charge",
      attribute_type: "number",
      unit: "km",
      required: true,
    },
    {
      attribute_name: "Charging Time",
      attribute_type: "number",
      unit: "hours",
      required: true,
    },
    {
      attribute_name: "Top Speed",
      attribute_type: "number",
      unit: "km/h",
      required: false,
    },
    {
      attribute_name: "Performance",
      attribute_type: "dropdown",
      options: ["High", "Medium", "Low"],
      required: false,
    },
  ],
  Accessories: [
    { attribute_name: "Compatibility", attribute_type: "text", required: true },
    { attribute_name: "Dimensions", attribute_type: "text", required: true },
    {
      attribute_name: "Material",
      attribute_type: "dropdown",
      options: ["Aluminum Alloy", "Plastic", "Steel"],
      required: false,
    },
    { attribute_name: "Overview", attribute_type: "textarea", required: false },
  ],
};

const DynamicForm = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      const categoryFields = predefinedSpecifications[selectedCategory] || [];
      const fixedCategoryFields = fixedFields[selectedCategory] || [];
      setDynamicFields([...formFields, ...categoryFields, ...fixedCategoryFields,]);
    } else {
      setDynamicFields(formFields);
    }
  }, [selectedCategory]);

  const validationSchema = Yup.object(
    dynamicFields.reduce((schema, field) => {
      if (field.required) {
        schema[field.name || field.attribute_name] =
          field.attribute_type === "number"
            ? Yup.number().required(
                `${field.label || field.attribute_name} is required`
              )
            : Yup.string().required(
                `${field.label || field.attribute_name} is required`
              );
      }
      return schema;
    }, {})
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/product",
        data
      );
      alert("Product created successfully!");
    } catch (error) {
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
      alert("Failed to create product.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700 ">
          Select Category
        </label>
        <select
          className="border rounded p-2 w-full bg-gray-50 text-gray-700 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200"
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {dynamicFields.map((field, index) => {
        const fieldName = field.name || field.attribute_name;


        switch (field.type || field.attribute_type) {
          case "text":
            return (
              <TextInput
                key={index}
                label={field.label || field.attribute_name}
                name={fieldName}
                register={register}
                required={field.required}
                errors={errors}
              />
            );
          case "textarea":
            return (
              <TextAreaInput
                key={index}
                label={field.label || field.attribute_name}
                name={fieldName}
                register={register}
                required={field.required}
                errors={errors}
              />
            );
          case "select":
          case "dropdown":
            return (
              <SelectInput
                key={index}
                label={field.label || field.attribute_name}
                name={fieldName}
                register={register}
                options={field.options}
                errors={errors}
              />
            );
          case "richtext":
            return (
              <RichTextEditor
                key={index}
                label={field.label || field.attribute_name}
                name={fieldName}
                control={control}
                errors={errors}
              />
            );
          case "number":
            return (
              <NumberInput
                key={index}
                label={field.label || field.attribute_name}
                name={fieldName}
                register={register}
                required={field.required}
                errors={errors}
              />
            );
          default:
            return null;
        }
      })}

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;
