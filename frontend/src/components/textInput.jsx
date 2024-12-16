import React from 'react';

const TextInput = ({ label, name, register, required, errors }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}:</label>
    <input
      type="text"
      {...register(name, { required })}
      className="w-full p-2 border border-gray-300 rounded"
    />
    {errors[name] && (
      <p className="text-red-500">{errors[name]?.message || `${label} is required`}</p>
    )}
  </div>
);

export default TextInput;

