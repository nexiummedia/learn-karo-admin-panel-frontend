"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Search } from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor?: (item: T, index: number) => string;
  // Pagination
  pagination?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  // Search
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilterKeys?: (keyof T)[];
  // Selection
  selectable?: boolean;
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: (allIds: string[]) => void;
  // States
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor = (item, index) => (typeof item.id === "string" ? item.id : String(index)),
  pagination = true,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  searchable = false,
  searchPlaceholder = "Search records...",
  searchFilterKeys,
  selectable = false,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  isLoading = false,
  emptyMessage = "No records found.",
  className = "",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // 1. Filtered data
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();

    return data.filter((item) => {
      if (searchFilterKeys && searchFilterKeys.length > 0) {
        return searchFilterKeys.some((key) => {
          const val = item[key];
          return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
        });
      }
      return Object.values(item).some((val) => {
        return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFilterKeys]);

  // 2. Sorted data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      // Handle numbers
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Handle strings
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      return sortDirection === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredData, sortKey, sortDirection]);

  // 3. Paginated data
  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (activePage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, activePage, pageSize]);

  const handleSort = (columnKey: string) => {
    if (sortKey === columnKey) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortKey(null);
        setSortDirection("asc");
      }
    } else {
      setSortKey(columnKey);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const currentIds = useMemo(
    () => paginatedData.map((item, idx) => keyExtractor(item, idx)),
    [paginatedData, keyExtractor]
  );

  const isAllCurrentPageSelected =
    currentIds.length > 0 && currentIds.every((id) => selectedIds.includes(id));

  const handleToggleSelectAll = () => {
    if (!onSelectAll) return;
    if (isAllCurrentPageSelected) {
      onSelectAll([]);
    } else {
      onSelectAll(currentIds);
    }
  };

  // Generate pagination buttons
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (activePage > 3) pages.push("...");
      const start = Math.max(2, activePage - 1);
      const end = Math.min(totalPages - 1, activePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (activePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Optional Toolbar: Search & Page size */}
      {searchable && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-colors"
            />
          </div>

          {pagination && (
            <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Main Table */}
      <div className="w-full overflow-x-auto border border-slate-200/90 rounded-xl bg-white shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="border-b border-slate-200/80 bg-slate-50/75 text-slate-600 font-medium">
            <tr>
              {selectable && (
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={isAllCurrentPageSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === "right"
                    ? "text-right"
                    : col.align === "center"
                      ? "text-center"
                      : "text-left";

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`py-3 px-4 text-xs font-medium uppercase tracking-wider ${alignClass} ${
                      col.sortable ? "cursor-pointer select-none hover:text-slate-900" : ""
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === "right"
                          ? "justify-end w-full"
                          : col.align === "center"
                            ? "justify-center w-full"
                            : ""
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-slate-900" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-slate-900" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 hover:text-slate-600 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-800">
            {isLoading ? (
              // Loading Skeleton
              Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, rIdx) => (
                <tr key={`skeleton-${rIdx}`} className="animate-pulse">
                  {selectable && (
                    <td className="py-3.5 px-4">
                      <div className="w-4 h-4 bg-slate-200 rounded" />
                    </td>
                  )}
                  {columns.map((col, cIdx) => (
                    <td key={`sk-cell-${cIdx}`} className="py-3.5 px-4">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-12 text-center text-xs text-slate-400 font-normal"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Table Rows
              paginatedData.map((item, index) => {
                const id = keyExtractor(item, index);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isSelected ? "bg-slate-50/90" : ""
                    }`}
                  >
                    {selectable && (
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectRow && onSelectRow(id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const alignClass =
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                            ? "text-center"
                            : "text-left";

                      return (
                        <td key={col.key} className={`py-3.5 px-4 align-middle ${alignClass}`}>
                          {col.cell ? col.cell(item, index) : (item[col.key] as React.ReactNode)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 py-1 text-xs text-slate-500">
          <div>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {totalItems === 0 ? 0 : (activePage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-800">
              {Math.min(activePage * pageSize, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-slate-800">{totalItems}</span> results
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage <= 1}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((num, idx) =>
                num === "..." ? (
                  <span key={`dots-${idx}`} className="px-2 py-1 text-slate-400 select-none">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${num}`}
                    onClick={() => setCurrentPage(Number(num))}
                    className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                      activePage === num
                        ? "bg-slate-900 text-white font-semibold shadow-2xs"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage >= totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
