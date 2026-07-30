import React, { useEffect, useState } from "react";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import GlobalTable from "../../common/GlobalTable";
import TableActionButton from "../../common/TableActionButton";

const TestSeriesList = ({ testSeries, onEdit, onDelete, onManageTests }) => {
  const seriesData = testSeries?.data
    ? testSeries.data.reduce((acc, item) => acc.concat(item.series), [])
    : [];
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // UI-only: search and pagination are applied to already fetched test series data.
  const filteredSeries = seriesData.filter((series) => {
    const search = searchTerm.toLowerCase();
    return (
      series.title?.toLowerCase().includes(search) ||
      series.title_tag?.toLowerCase().includes(search) ||
      series.exam_id?.name?.toLowerCase().includes(search) ||
      String(series.price || "").includes(search) ||
      String(series.discount_price || "").includes(search)
    );
  });

  const totalPages = Math.max(Math.ceil(filteredSeries.length / pageSize), 1);
  const paginatedSeries = filteredSeries.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisibleSeries = filteredSeries.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleSeries = Math.min(currentPage * pageSize, filteredSeries.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // UI-only: shared global table columns and action symbols.
  const columns = [
    {
      key: "title",
      header: "Title",
      render: (series) => (
        <>
          <div className="text-sm font-medium text-gray-900">{series.title}</div>
          <div className="text-sm text-gray-500">{series.title_tag}</div>
        </>
      ),
    },
    {
      key: "exam",
      header: "Exam",
      render: (series) => <div className="text-sm text-gray-900">{series.exam_id?.name || "N/A"}</div>,
    },
    {
      key: "price",
      header: "Price",
      render: (series) => (
        <div className="text-sm text-gray-900">
          {series.discount_price > 0 ? (
            <>
              <span className="line-through text-gray-400 mr-2">₹{series.price}</span>
              <span className="text-green-600 font-semibold">₹{series.discount_price}</span>
            </>
          ) : (
            `₹${series.price}`
          )}
        </div>
      ),
    },
    {
      key: "total_tests",
      header: "Tests",
      render: (series) => series.total_tests,
    },
    {
      key: "status",
      header: "Status",
      render: (series) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${series.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {series.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (series) => (
        <div className="flex items-center gap-2">
          <TableActionButton
            tone="edit"
            onClick={() => onEdit(series)}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </TableActionButton>
          <TableActionButton
            tone="view"
            onClick={() => onManageTests(series)}
            title="Manage Tests"
          >
            <ClipboardList className="h-4 w-4" />
          </TableActionButton>
          <TableActionButton
            tone="delete"
            onClick={() => onDelete(series._id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </TableActionButton>
        </div>
      ),
    },
  ];

  return (
    // UI-only: global table adds consistent filters, export, and Previous/Next controls.
    <GlobalTable
      title={`Test Series (${filteredSeries.length})`}
      filters={{
        searchValue: searchTerm,
        onSearchChange: (value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        },
        searchPlaceholder: "Search test series...",
        resultText: `${filteredSeries.length} test series found`,
        exportData: filteredSeries,
        exportFileName: "test-series.csv",
        exportColumns: [
          { key: "title", header: "Title" },
          { key: "title_tag", header: "Title Tag" },
          { key: "exam", header: "Exam", value: (series) => series.exam_id?.name || "N/A" },
          { key: "price", header: "Price" },
          { key: "discount_price", header: "Discount Price" },
          { key: "total_tests", header: "Total Tests" },
          { key: "status", header: "Status", value: (series) => series.is_active ? "Active" : "Inactive" },
        ],
      }}
      columns={columns}
      data={paginatedSeries}
      emptyText="No test series found. Get started by creating a new test series."
      getRowKey={(series) => series._id}
      pagination={{
        currentPage,
        totalPages,
        onPageChange: setCurrentPage,
        rightContent: (
          <p className="text-sm text-gray-500">
            Showing {firstVisibleSeries}-{lastVisibleSeries} of {filteredSeries.length}
          </p>
        ),
      }}
    />
  );
};

export default TestSeriesList;
