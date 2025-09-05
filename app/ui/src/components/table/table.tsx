import { Fragment, useEffect, useMemo, useState } from "react";
import { NormalizeData, TableChangeEvent, TableProps } from "./types";
import { TABLE_FIELD_DETAIL, normalizeData } from "./utils";
import { table } from "@nextui-org/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Table = <T extends Record<string, any>>({
  columns,
  data,
  dataItemKey,
  detail: Detail,
}: TableProps<T>) => {
  const [innerData, setInnerData] = useState<NormalizeData<T>[]>([]);

  const slots = useMemo(
    () =>
      table({
        isSelectable: false,
        isMultiSelectable: false,
      }),
    []
  );

  useEffect(() => {
    setInnerData(normalizeData(data));
  }, [data]);

  const handleChange = ({
    rowIndex,
    field,
    value,
  }: TableChangeEvent<NormalizeData<T>>) => {
    const copyData = innerData.slice();
    copyData[rowIndex][field] = value as NormalizeData<T>[Extract<
      keyof T,
      string
    >];

    setInnerData(copyData);
  };

  return (
    <div className={slots.base()}>
      <div className={slots.wrapper()}>
        <table className={slots.table()}>
          <thead className={slots.thead()}>
            <tr className={slots.tr()}>
              {columns.map((column) => (
                <th key={column.field || column.title} className={slots.th()}>
                  {column.title ?? ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={slots.tbody()}>
            {innerData.length === 0 && (
              <tr className={slots.tr()}>
                <td
                  className={slots.td()}
                  style={{ textAlign: "center" }}
                  colSpan={columns.length}
                >
                  No data
                </td>
              </tr>
            )}

            {innerData.length > 0 &&
              innerData.map((item, itemIndex) => (
                <Fragment key={item[dataItemKey]}>
                  <tr className={slots.tr()}>
                    {columns.map((column, columnIndex) => {
                      const key = column.field ?? column.title;

                      if ("cell" in column && column.cell) {
                        return (
                          <td key={key} className={slots.td()}>
                            <column.cell
                              field={column.field}
                              dataItem={item}
                              rowIndex={itemIndex}
                              colIndex={columnIndex}
                              onChange={handleChange}
                            />
                          </td>
                        );
                      }

                      return (
                        <td key={key} className={slots.td()}>
                          {item[column.field ?? ""] ?? null}
                        </td>
                      );
                    })}
                  </tr>

                  {item[TABLE_FIELD_DETAIL] && (
                    <tr className={slots.tr()}>
                      <td
                        className={slots.td()}
                        style={{ textAlign: "center" }}
                        colSpan={columns.length}
                      >
                        {Detail ? <Detail dataItem={item} /> : "detail"}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
