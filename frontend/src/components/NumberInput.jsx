import React from 'react';

const NumberInput = ({ name, label, value, onChange, required = false, min, max, step }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block font-medium mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        step={step}
        className="w-full p-2 border rounded-md"
      />
    </div>
  );
};

export default NumberInput;
