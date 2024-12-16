import React from 'react';

const SelectInput = ({ label, name, register, options, errors }) => (
  <div className="mb-4">
    <label className="block text-gray-700">{label}:</label>
    <select {...register(name)} className="w-full p-2 border border-gray-300 rounded">
      <option value="">Select {label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
    {errors[name] && <p className="text-red-500">{errors[name]?.message}</p>}
  </div>
);

export default SelectInput;

  