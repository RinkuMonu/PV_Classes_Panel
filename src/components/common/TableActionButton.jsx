import React from "react";

const toneClasses = {
  default: "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50",
  view: "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50",
  edit: "border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50",
  delete: "border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50",
  success: "border-green-300 text-green-600 hover:border-green-400 hover:bg-green-50",
};

const TableActionButton = ({ children, tone = "default", className = "", ...props }) => {
  return (
    <button
      type="button"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-md border bg-white shadow-sm transition-colors ${toneClasses[tone] || toneClasses.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default TableActionButton;
