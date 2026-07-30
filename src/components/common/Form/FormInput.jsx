const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
  step,
  disabled = false,
  className = "",
  inputClassName = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition disabled:opacity-60 ${inputClassName}`}
        {...props}
      />
    </div>
  );
};

export default FormInput;
