import React from 'react';

const TextAreaInput = ({ label, name, register, required, errors }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}:</label>
    <textarea
      {...register(name, { required })}
      className="w-full p-2 border border-gray-300 rounded"
    ></textarea>
    {errors[name] && (
      <p className="text-red-500">{errors[name]?.message || `${label} is required`}</p>
    )}
  </div>
);

export default TextAreaInput;
