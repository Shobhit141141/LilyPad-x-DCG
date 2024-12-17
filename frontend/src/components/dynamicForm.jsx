import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import TextInput from './textInput';
import TextAreaInput from './TextAreaInput';
import SelectInput from './selectinput';
import RichTextEditor from './RichTextEditor';

// Form configuration
const formFields = [
  { type: 'text', label: 'Product Name', name: 'productName', required: true },
  { type: 'text', label: 'SKU', name: 'sku', required: false },
  { type: 'select', label: 'Brand', name: 'brand', options: ['2 Wheeler', '3 Wheeler', '4 Wheeler'], required: false },
  { type: 'textarea', label: 'Short Description', name: 'shortDescription', required: false },
  { type: 'richtext', label: 'Long Description', name: 'longDescription', required: true },
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
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
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

