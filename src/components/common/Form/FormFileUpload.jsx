const FormFileUpload = ({
  label,
  name,
  onChange,
  accept = "image/*",
  previewUrl,
  previewAlt = "Preview",
  helperText,
  className = "",
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition hover:border-[#87b105]">
        <span className="text-sm font-medium text-gray-700">Upload image</span>
        {helperText && <span className="mt-1 text-xs text-gray-500">{helperText}</span>}
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
      </label>

      {previewUrl && (
        <div className="mt-3 flex items-center gap-3">
          <img
            src={previewUrl}
            alt={previewAlt}
            className="h-16 w-16 rounded-md border border-gray-200 object-cover"
          />
          <span className="text-xs text-gray-500">{previewAlt}</span>
        </div>
      )}
    </div>
  );
};

export default FormFileUpload;
