import axios from "axios";
import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import toast from 'react-hot-toast';

// Predefined specifications for the categories
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
      required: true,
    },
    {
      attribute_name: "Performance",
      attribute_type: "dropdown",
      options: ["High", "Medium", "Low"],
      required: true,
    },
  ],
  Accessories: [
    { attribute_name: "Compatibility", attribute_type: "text", required: true },
    { attribute_name: "Dimensions", attribute_type: "text", required: true },
    {
      attribute_name: "Material",
      attribute_type: "dropdown",
      options: ["Aluminum Alloy", "Plastic", "Steel"],
      required: true,
    },
    { attribute_name: "Overview", attribute_type: "textarea", required: true },
  ],
};

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brand: "",
    short_description: "",
    long_description: "",
    category_name: "",
    price: "",
    discount_price: "",
    tax_rate: "",
    stock_quantity: "",
    stock_status: "In Stock",
    low_stock_alert_threshold: "",
    technical_specifications: [],
  });

  const [errors, setErrors] = useState({});
  const [categoryFields, setCategoryFields] = useState([]);

  const categories = ["EV Bikes/Scooters", "Accessories"];

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const specs = predefinedSpecifications[selectedCategory] || [];
    
    setFormData({
      ...formData,
      category_name: selectedCategory,
      technical_specifications: specs.map(spec => ({
        attribute_name: spec.attribute_name,
        attribute_type: spec.attribute_type,
        attribute_value: "",
        required: spec.required,
        options: spec.options, 
        unit: spec.unit
      }))
    });
    
    setCategoryFields(specs);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSpecificationChange = (index, e) => {
    const updatedSpecifications = [...formData.technical_specifications];
    updatedSpecifications[index] = {
      ...updatedSpecifications[index],
      attribute_value: e.target.value
    };
    setFormData({
      ...formData,
      technical_specifications: updatedSpecifications,
    });
  };

  const validate = () => {
    const validationErrors = {};
    
    if (!formData.name.trim()) validationErrors.name = "Name is required";
    if (!formData.sku.trim()) validationErrors.sku = "SKU is required";
    if (!formData.long_description.trim()) validationErrors.long_description = "Description is required";
    if (!formData.brand.trim()) validationErrors.brand = "Brand is required";
    if (!formData.short_description.trim()) validationErrors.short_description = "Short Description is required";
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) validationErrors.price = "Price must be greater than 0";
    if (!formData.discount_price.trim()) validationErrors.discount_price = "Discounted Price is required";
    
    const tax_rate = parseFloat(formData.tax_rate);
    if (isNaN(tax_rate) || tax_rate < 0 || tax_rate > 100) validationErrors.tax_rate = "Tax rate must be between 0 and 100";
    const stockQuantity = parseInt(formData.stock_quantity);
    if (isNaN(stockQuantity) || stockQuantity < 0) validationErrors.stock_quantity = "Stock quantity must be 0 or greater";
    
    const threshold = parseInt(formData.low_stock_alert_threshold);
    if ((isNaN(threshold) || threshold >= stockQuantity)) {
      validationErrors.low_stock_alert_threshold = "Alert threshold must be less than stock quantity";
    }

    if (!formData.category_name) {
      validationErrors.category_name = "Category is required";
    }

    formData.technical_specifications.forEach((spec, index) => {
      if (spec.required && !spec.attribute_value.toString().trim()) {
        validationErrors[`spec_${index}`] = `${spec.attribute_name} is required`;
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formattedData = {
        ...formData,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        tax_rate: formData.tax_rate ? parseFloat(formData.tax_rate) : 0,
        stock_quantity: parseInt(formData.stock_quantity),
        low_stock_alert_threshold: formData.low_stock_alert_threshold 
          ? parseInt(formData.low_stock_alert_threshold) 
          : null
      };

      const response = await axios.post("http://localhost:5000/api/product", formattedData);

      toast.success("Form submitted successfully!");

      setFormData({
        name: "",
        sku: "",
        brand: "",
        short_description: "",
        long_description: "",
        category_name: "",
        price: "",
        discount_price: "",
        tax_rate: "",
        stock_quantity: "",
        stock_status: "In Stock",
        low_stock_alert_threshold: "",
        technical_specifications: [],
      });
      setErrors({});
      
    } catch (error) {
      console.error("Error:", error);
      setErrors({ submit: error.response.data.message });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">Product Form</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block mb-1">SKU:</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
        </div>

        <div>
          <label className="block mb-1">Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
        </div>

        <div>
          <label className="block mb-1">Short Description:</label>
          <input
            type="text"
            name="short_description"
            value={formData.short_description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.short_description && <p className="text-red-500 text-sm mt-1">{errors.short_description}</p>}
        </div>

        {/* <div>
          <label className="block mb-1">Long Description:</label>
          <textarea
            name="long_description"
            value={formData.long_description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {errors.long_description && (
            <p className="text-red-500 text-sm mt-1">{errors.long_description}</p>
          )}
        </div> */}

        <RichTextEditor
        label={"Long Description"}
          value={formData.long_description}
          onChange={(value) => setFormData({ ...formData, long_description: value })}
          error={errors.long_description}


        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block mb-1">Discount Price:</label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.discount_price && <p className="text-red-500 text-sm mt-1">{errors.discount_price}</p>}
          </div>

          <div>
            <label className="block mb-1">Tax Rate (%):</label>
            <input
              type="number"
              name="tax_rate"
              value={formData.tax_rate}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.tax_rate && <p className="text-red-500 text-sm mt-1">{errors.tax_rate}</p>}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Stock Quantity:</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.stock_quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Stock Status:</label>
            <select
              name="stock_status"
              value={formData.stock_status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-Order">Pre-Order</option>
            </select>
            {errors.stock_status && <p className="text-red-500 text-sm mt-1">{errors.stock_status}</p>}
          </div>

          <div>
            <label className="block mb-1">Low Stock Alert Threshold:</label>
            <input
              type="number"
              name="low_stock_alert_threshold"
              value={formData.low_stock_alert_threshold}
              onChange={handleInputChange}
              min="0"
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.low_stock_alert_threshold && (
              <p className="text-red-500 text-sm mt-1">{errors.low_stock_alert_threshold}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1">Category:</label>
          <select
            name="category_name"
            value={formData.category_name}
            onChange={handleCategoryChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category_name && (
            <p className="text-red-500 text-sm mt-1">{errors.category_name}</p>
          )}
        </div>

        {formData.technical_specifications.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl">Technical Specifications</h2>
            {formData.technical_specifications.map((spec, index) => (
              <div key={spec.attribute_name}>
                <label className="block mb-1">
                  {spec.attribute_name}
                  {spec.required && <span className="text-red-500">*</span>}
                  {spec.unit && <span className="text-gray-500 text-sm"> ({spec.unit})</span>}:
                </label>
                
                {spec.attribute_type === "dropdown" && (
                  <select
                    value={spec.attribute_value}
                    onChange={(e) => handleSpecificationChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select {spec.attribute_name}</option>
                    {spec.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {spec.attribute_type === "number" && (
                  <input
                    type="number"
                    value={spec.attribute_value}
                    onChange={(e) => handleSpecificationChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                )}

                {spec.attribute_type === "text" && (
                  <input
                    type="text"
                    value={spec.attribute_value}
                    onChange={(e) => handleSpecificationChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                )}

                {spec.attribute_type === "textarea" && (
                  <textarea
                    value={spec.attribute_value}
                    onChange={(e) => handleSpecificationChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={4}
                  />
                )}

                {errors[`spec_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`spec_${index}`]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {errors.submit && <p className="text-red-500 text-sm mt-1">{errors.submit}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default App;