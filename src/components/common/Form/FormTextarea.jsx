const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  disabled = false,
  className = "",
  textareaClassName = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        disabled={disabled}
        className={`w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-[#87b105] focus:border-[#87b105] outline-none transition disabled:opacity-60 ${textareaClassName}`}
        {...props}
      />
    </div>
  );
};

export default FormTextarea;
