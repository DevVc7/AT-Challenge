import { TABLE_FIELD_DETAIL } from "./utils";

export type NormalizeData<T> = T & {
  [TABLE_FIELD_DETAIL]: boolean;
};

export type TableChangeEvent<T extends Record<string, unknown>> = {
  rowIndex: number;
  field: Extract<keyof NormalizeData<T>, string>;
  value: unknown;
};

export type DetailProps<T extends Record<string, unknown>> = {
  dataItem: NormalizeData<T>;
};

export type CellProps<T extends Record<string, unknown>> = {
  field?: Extract<keyof NormalizeData<T>, string>;
  dataItem: NormalizeData<T>;
  rowIndex: number;
  colIndex: number;
  onChange: (event: TableChangeEvent<NormalizeData<T>>) => void;
};

export type TableColumn<T extends Record<string, unknown>> = {
  field?: Extract<keyof NormalizeData<T>, string>;
  title?: string;
  cell?: React.ComponentType<CellProps<T>>;
};

export type TableProps<T extends Record<string, unknown>> = {
  columns: TableColumn<T>[];
  data: T[];
  dataItemKey: Extract<keyof T, string>;
  detail?: React.ComponentType<DetailProps<T>>;
};
