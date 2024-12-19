import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import TextInput from './textInput';
import TextAreaInput from './TextAreaInput';
import SelectInput from './selectinput';
import RichTextEditor from './RichTextEditor';
import NumberInput from './NumberInput';

const formFields = [
  { type: 'text', label: 'Product Name', name: 'productName', required: true },
  { type: 'text', label: 'SKU', name: 'sku', required: false },
  { type: 'select', label: 'Brand', name: 'brand', options: ['2 Wheeler', '3 Wheeler', '4 Wheeler'], required: false },
  { type: 'textarea', label: 'Short Description', name: 'shortDescription', required: false },
  { type: 'richtext', label: 'Long Description', name: 'longDescription', required: true },
];


const categories = [
    "EV Bikes/Scooters",
    "Accessories"
  ];

  const predefinedSpecifications = {
    "EV Bikes/Scooters": [
      { attribute_name: "Motor Power", attribute_type: "number", required: true },
      { attribute_name: "Battery Type", attribute_type: "dropdown", options: ["Lithium-Ion", "Lead-Acid"], required: true },
      { attribute_name: "Range Per Charge", attribute_type: "number", unit: "km", required: true },
      { attribute_name: "Charging Time", attribute_type: "number", unit: "hours", required: true },
      { attribute_name: "Top Speed", attribute_type: "number", unit: "km/h", required: false },
      { attribute_name: "Performance", attribute_type: "dropdown", options: ["High", "Medium", "Low"], required: false }
    ],
    "Accessories": [
      { attribute_name: "Compatibility", attribute_type: "text", required: true },
      { attribute_name: "Dimensions", attribute_type: "text", required: true },
      { attribute_name: "Material", attribute_type: "dropdown", options: ["Aluminum Alloy", "Plastic", "Steel"], required: false },
      { attribute_name: "Overview", attribute_type: "textarea", required: false }
    ]
  };

  const additionalFields = [
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'discount_price', label: 'Discount Price', type: 'number', required: false },
    { name: 'tax_rate', label: 'Tax Rate', type: 'number', required: false },
    { name: 'stock_quantity', label: 'Stock Quantity', type: 'number', required: true },
    { name: 'stock_status', label: 'Stock Status', type: 'select', options: ['In Stock', 'Out of Stock', 'Pre-Order'], required: false },
    { name: 'low_stock_alert_threshold', label: 'Low Stock Alert Threshold', type: 'number', required: false },
    { name: 'created_at', label: 'Created At', type: 'text', required: false, readOnly: true },
    { name: 'updated_at', label: 'Updated At', type: 'text', required: false, readOnly: true },
  ];


const validationSchema = Yup.object(
  formFields.reduce((schema, field) => {
    if (field.required) {
      schema[field.name] = Yup.string().required(`${field.label} is required`);
    }
    return schema;
  }, {})
);

const DynamicForm = () => {

    const [selectedCategory, setSelectedCategory] = useState('');
    const [dynamicFields, setDynamicFields] = useState([]);
    const [validationSchema, setValidationSchema] = useState(Yup.object({}));
    const {
            register, handleSubmit, control, formState: { errors }} = useForm({
            resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
        if (selectedCategory) {
        //   axios.get(`/api/getFields=${selectedCategory}`)
            // .then((response) => {
            //   const fields = response.data;

            //   setDynamicFields([
            //     // ...fields.compulsoryFields,
            //     // ...fields.referenceFields,
            //     // ...fields.conditionalFields,
            //     ...additionalFields, 
            //   ]);

            const categoryFields = categorySpecificFields[selectedCategory] || [];
      const combinedFields = [...categoryFields, ...additionalFields];
      setDynamicFields(combinedFields);
    
              const schema = Yup.object(
                combinedFields.reduce((acc, field) => {
                  if (field.required) {
                    acc[field.name] = field.type === 'text'
                      ? Yup.string().required(`${field.label} is required`)
                      : Yup.number().required(`${field.label} is required`);
                  }
                  return acc;
                }, {})
              );

              setValidationSchema(schema);
        }else{setDynamicFields([]);
            setValidationSchema(Yup.object({}));
        }
  }, [selectedCategory]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/product', data);
      console.log('Response:', response.data);
      alert('Product created successfully!');
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert('Failed to create product.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">

<div className="mb-4">
        <label htmlFor="category" className="block text-gray-700">
          Select Category
        </label>
        <select
          id="category"
          className="border rounded p-2 w-full"
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

      {formFields.map((field, index) => {
        switch (field.type) {
          case 'text':
            return (
              <TextInput
                key={index}
                label={field.label}
                name={field.name}
                register={register}
                required={field.required}
                errors={errors}
              />
            );
          case 'textarea':
            return (
              <TextAreaInput
                key={index}
                label={field.label}
                name={field.name}
                register={register}
                required={field.required}
                errors={errors}
              />
            );
          case 'select':
            return (
              <SelectInput
                key={index}
                label={field.label}
                name={field.name}
                register={register}
                options={field.options}
                errors={errors}
              />
            );
          case 'richtext':
            return (
              <RichTextEditor
                key={index}
                label={field.label}
                name={field.name}
                control={control}
                errors={errors}
              />
            );
          default:
            return null;
        }
      })}

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Submit
      </button>
    </form>
  );
};

export default DynamicForm;

