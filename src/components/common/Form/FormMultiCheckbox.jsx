import { useId, useState } from "react";
import { Search, X } from "lucide-react";

const FormMultiCheckbox = ({
  label,
  options = [],
  selectedValues = [],
  onToggle,
  emptyText = "No options available",
  getOptionValue = (item) => item.value,
  getOptionLabel = (item) => item.label,
  className = "",
  listClassName = "",
}) => {
  // UI-only: each checkbox group keeps its own search query and filters visible options without changing selections.
  const searchId = useId();
  const [searchTerm, setSearchTerm] = useState("");
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredOptions = normalizedSearch
    ? options.filter((item) =>
        String(getOptionLabel(item) ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : options;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative mb-2">
        <label htmlFor={searchId} className="sr-only">
          Search {label || "options"}
        </label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          id={searchId}
          type="text"
          role="searchbox"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={`Search ${label || "options"}...`}
          className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-9 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#87b105] focus:ring-2 focus:ring-[#87b105]/20"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            aria-label={`Clear ${label || "options"} search`}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Shared multi-select UI: scrollable checkbox list with hidden scrollbar. */}
      <div className={`w-full p-3 border border-gray-300 rounded-md h-40 overflow-y-auto no-scrollbar space-y-2 ${listClassName}`}>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((item) => {
            const value = getOptionValue(item);

            return (
              <label key={value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => onToggle(value)}
                  className="h-4 w-4 accent-[#87b105]"
                />
                <span>{getOptionLabel(item)}</span>
              </label>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">
            {options.length > 0
              ? `No matching ${label || "options"} found`
              : emptyText}
          </p>
        )}
      </div>

      <p className="text-xs text-blue-600 mt-1">{selectedValues.length} selected</p>
    </div>
  );
};

export default FormMultiCheckbox;
