const radioGroup = ({ label, register, name, options, validation, errors }) => (
    <div className="mb-4">
      <p className="block text-gray-700 font-medium mb-2">{label}</p>
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input type="radio" value={option.value} {...register(name, validation)} />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
      {errors[name] && <p className="text-red-500 text-sm">{errors[name].message}</p>}
    </div>
  );
  
  export default radioGroup;
  