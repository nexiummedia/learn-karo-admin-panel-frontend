import React from "react";

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <div className="w-full overflow-x-auto border border-slate-200/90 rounded-xl bg-white shadow-2xs">
    <table className={`w-full text-left text-xs border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <thead
    className={`border-b border-slate-200/80 bg-slate-50/75 text-slate-500 font-medium ${className}`}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <tbody className={`divide-y divide-slate-100 text-slate-800 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <tr className={`hover:bg-slate-50/70 transition-colors group ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <th
    className={`py-3 px-4 text-xs font-medium text-slate-600 uppercase tracking-wider ${className}`}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <td className={`py-3.5 px-4 align-middle ${className}`} {...props}>
    {children}
  </td>
);

export const TableEmpty: React.FC<{ message?: string; colSpan?: number }> = ({
  message = "No records found.",
  colSpan = 5,
}) => (
  <tr>
    <td colSpan={colSpan} className="py-12 text-center text-xs text-slate-400 font-normal">
      {message}
    </td>
  </tr>
);
