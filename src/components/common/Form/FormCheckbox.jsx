const FormCheckbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = "",
  checkboxClassName = "",
}) => {
  return (
    <label className={`flex items-center gap-2 text-sm text-gray-700 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`h-4 w-4 accent-[#87b105] disabled:opacity-60 ${checkboxClassName}`}
      />
      <span>{label}</span>
    </label>
  );
};

export default FormCheckbox;
