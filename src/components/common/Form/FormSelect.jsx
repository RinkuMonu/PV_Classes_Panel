const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  required = false,
  disabled = false,
  className = "",
  selectClassName = "",
  getOptionValue = (item) => item.value,
  getOptionLabel = (item) => item.label,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition disabled:opacity-60 ${selectClassName}`}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((item) => (
          <option key={getOptionValue(item)} value={getOptionValue(item)}>
            {getOptionLabel(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
