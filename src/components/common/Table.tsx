'use client';

import type { PropsWithChildren } from 'react';

type TableRootProps = PropsWithChildren<{
  className?: string;
}>;

function TableRoot({ children, className }: TableRootProps) {
  const merged = ['rounded-xl border border-gray-20 bg-white overflow-hidden', className].filter(Boolean).join(' ');
  return (
    <section className={merged}>
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
  const merged = ['last:[&>td]:border-b-0 last:[&>th]:border-b-0', className]
    .filter(Boolean)
    .join(' ');
  return <tr className={merged}>{children}</tr>;
}

type TableHeaderCellProps = PropsWithChildren<{
  className?: string;
}>;

function TableHeaderCell({ children, className }: TableHeaderCellProps) {
  const merged = ['tj-body2 text-left py-3 px-6 text-gray-black bg-gray-10', className]
    .filter(Boolean)
    .join(' ');
  return <th className={merged}>{children}</th>;
}

type TableCellProps = PropsWithChildren<{
  className?: string;
  colSpan?: number;
}>;

function TableCell({ children, className, colSpan }: TableCellProps) {
  const merged = [
    'h-[60px] tj-body1 px-6 text-gray-black align-middle border-b border-gray-20',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <td className={merged} colSpan={colSpan}>
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
