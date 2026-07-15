import React from "react";
import { Download, Search } from "lucide-react";

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);
  const shouldEscape =
    stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n");

  if (!shouldEscape) return stringValue;

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const downloadCsv = ({ data, columns, fileName }) => {
  const exportColumns =
    columns?.length > 0
      ? columns
      : Object.keys(data[0] || {}).map((key) => ({
          key,
          header: key,
        }));

  const headers = exportColumns.map((column) => escapeCsvValue(column.header || column.key));
  const rows = data.map((row, rowIndex) =>
    exportColumns.map((column) => {
      const value = column.value ? column.value(row, rowIndex) : row[column.key];
      return escapeCsvValue(value);
    })
  );

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName || `table-export-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

const TableFilters = ({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  resultText,
  rightContent,
  exportData,
  exportColumns,
  exportFileName,
  onExport,
  exportLabel = "Export CSV",
}) => {
  const canExport = onExport || Array.isArray(exportData);

  const handleExport = () => {
    if (onExport) {
      onExport();
      return;
    }

    downloadCsv({
      data: exportData || [],
      columns: exportColumns,
      fileName: exportFileName,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {onSearchChange && (
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#87b105] focus:ring-2 focus:ring-[#87b105]/20"
              />
            </div>
          </div>
        )}

        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(event) => filter.onChange(event.target.value)}
            className="min-w-[180px] rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-[#87b105] focus:ring-2 focus:ring-[#87b105]/20"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}

        {resultText && <div className="text-sm text-gray-600">{resultText}</div>}

        {(canExport || rightContent) && (
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {canExport && (
              <button
                type="button"
                onClick={handleExport}
                disabled={Array.isArray(exportData) && exportData.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-[#204972] hover:bg-[#183654] px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                {exportLabel}
              </button>
            )}

            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableFilters;
