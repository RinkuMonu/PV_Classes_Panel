const FormActions = ({
  onCancel,
  onSubmitClick,
  submitText = "Submit",
  cancelText = "Cancel",
  loading = false,
  submitType = "submit",
  className = "",
}) => {
  return (
    <div className={`flex justify-end gap-3 pt-4 ${className}`}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-red-600 text-white rounded-md hover:scale-105 transition form-cancel-button"
        >
          {cancelText}
        </button>
      )}

      <button
        type={submitType}
        onClick={onSubmitClick}
        disabled={loading}
        className="px-5 py-2 bg-[#87b105] text-white rounded-md hover:scale-105 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </div>
  );
};

export default FormActions;
