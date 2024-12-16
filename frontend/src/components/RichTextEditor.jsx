import React from 'react';
import { Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ label, name, control, errors }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}:</label>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ReactQuill {...field} className="bg-white border border-gray-300 rounded" />
      )}
    />
    {errors[name] && (
      <p className="text-red-500">{errors[name]?.message || `${label} is required`}</p>
    )}
  </div>
);

export default RichTextEditor;
