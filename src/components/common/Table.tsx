'use client';

import type { PropsWithChildren } from 'react';

type TableRootProps = PropsWithChildren<{
  className?: string;
}>;

function TableRoot({ children, className }: TableRootProps) {
  return (
    <section className={`rounded-xl border border-gray-20 bg-white ${className ?? ''}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">{children}</table>
      </div>
    </section>
  );
}

type TableHeadProps = PropsWithChildren<{
  className?: string;
}>;

function TableHead({ children, className }: TableHeadProps) {
  return <thead className={className}>{children}</thead>;
}

type TableBodyProps = PropsWithChildren<{
  className?: string;
}>;

function TableBody({ children, className }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

type TableRowProps = PropsWithChildren<{
  className?: string;
}>;

function TableRow({ children, className }: TableRowProps) {
  return <tr className={`border-b border-gray-10 last:border-b-0 ${className ?? ''}`}>{children}</tr>;
}

type TableHeaderCellProps = PropsWithChildren<{
  className?: string;
}>;

function TableHeaderCell({ children, className }: TableHeaderCellProps) {
  return (
    <th className={`tj-body2 text-left py-3 px-6 text-gray-black bg-gray-10 ${className ?? ''}`}>
      {children}
    </th>
  );
}

type TableCellProps = PropsWithChildren<{
  className?: string;
}>;

function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={`h-[60px] tj-body1 px-6 text-gray-black align-middle ${className ?? ''}`}>
      {children}
    </td>
  );
}

export const Table = Object.assign(TableRoot, {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell,
});
