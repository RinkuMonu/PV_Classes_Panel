import React from "react";
import TableFilters from "./TableFilters";

const tableClasses = {
  wrapper: "bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden",
  scroll: "overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
  table: "min-w-full divide-y divide-gray-200",
  thead: "bg-gray-50",
  th: "px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap",
  tbody: "bg-white divide-y divide-gray-200",
  tr: "hover:bg-gray-50 transition-colors",
  td: "px-6 py-4 text-sm text-gray-800 align-middle",
  empty: "px-6 py-10 text-center text-sm text-gray-500",
};

const GlobalTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyText = "No records found",
  loadingText = "Loading data...",
  getRowKey,
  wrapperClassName = "",
  pagination,
  title,
  description,
  actions,
  toolbar,
  filters,
}) => {
  const totalPages = Math.max(Number(pagination?.totalPages || 1), 1);
  const currentPage = Math.min(Math.max(Number(pagination?.currentPage || 1), 1), totalPages);
  const hasPagination = Boolean(pagination);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={`${tableClasses.wrapper} ${wrapperClassName}`}>
      {(title || description || actions || toolbar || filters) && (
        <div className="border-b border-gray-200 bg-white p-4">
          {(title || description || actions) && (
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
              </div>

              {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
            </div>
          )}

          {filters ? (
            <TableFilters {...filters} />
          ) : (
            toolbar
          )}
        </div>
      )}

      <div className={tableClasses.scroll}>
        <table className={tableClasses.table}>
          <thead className={tableClasses.thead}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${tableClasses.th} ${column.headerClassName || ""}`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={tableClasses.tbody}>
            {loading ? (
              <tr>
                <td className={tableClasses.empty} colSpan={columns.length || 1}>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#204972]" />
                    <span>{loadingText}</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey ? getRowKey(row, rowIndex) : row._id || row.id || rowIndex}
                  className={tableClasses.tr}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${tableClasses.td} ${column.cellClassName || ""}`}
                    >
                      {column.render ? column.render(row, rowIndex) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className={tableClasses.empty} colSpan={columns.length || 1}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Permanent shared pagination footer for all global tables. */}
      {hasPagination && (
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => pagination.onPageChange?.(currentPage - 1)}
              disabled={!canGoPrevious || loading}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="min-w-[110px] text-center text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => pagination.onPageChange?.(currentPage + 1)}
              disabled={!canGoNext || loading}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {pagination.rightContent && (
            <div className="flex justify-center sm:justify-end">
              {pagination.rightContent}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalTable;
