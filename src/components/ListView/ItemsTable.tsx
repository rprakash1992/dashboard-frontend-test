import { memo, useEffect, useState } from "react";
import {
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "mantine-react-table";
import { Table, useMantineColorScheme } from "@mantine/core";
import { flexRender } from "@tanstack/react-table";
import classes from "./TableView.module.css";
import { isDraggable } from "../DragWrapper";
import type { ItemMetadataType, TableColumnType } from "../../types";

interface TableViewProps {
  tableColumn: MRT_ColumnDef<TableColumnType>[];
  tableData: TableColumnType[];
}

export const ItemsTable = ({ tableColumn, tableData }: TableViewProps) => {
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const { colorScheme } = useMantineColorScheme();
  // const bgColor = colorScheme === "dark" ? "#35343447" : "#f2f2f2d4";
  const borderColor = colorScheme === "dark" ? "#35343475" : "rgb(237 237 237)";

  const tableRowClass =
    colorScheme === "dark"
      ? classes.tableRowDarkTheme
      : classes.tableRowLightTheme;

  const table = useMantineReactTable({
    columns: tableColumn,
    data: tableData,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enablePagination: false,
    enableColumnActions: false,
    enableSorting: false,
    // enableRowSelection: true,
    enableRowSelection: false,
    enableSubRowSelection: true,
    enableExpanding: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => row.uniqId,
    getSubRows: (originalRow) => originalRow.children,
    mantineSelectCheckboxProps: ({ row }) => ({
      color: "violet",
      disabled: row.original.children ? true : false,
      styles: {
        root: { display: row.original.children && "none" },
        input: { cursor: "pointer" },
      },
    }),
    mantineExpandButtonProps: ({ row }) => ({
      disabled: !row.original.children ? true : false,
      style: { display: !row.original.children ? "none" : "undefined" },
    }),
    initialState: {
      expanded: { 0: true },
    },
  });

  useEffect(() => {
    const selectedRow = table.getSelectedRowModel();
    const updatedRows = selectedRow.flatRows.map((i) => i?.original);
    if (updatedRows && updatedRows?.length !== 0) {
    }
  }, [rowSelection]);

  const handleDrag = (e: React.DragEvent, ele: ItemMetadataType) => {
    e.dataTransfer.setData("dragItem", JSON.stringify(ele));
  };

  return (
    <Table
      captionSide="top"
      fz="md"
      // highlightOnHover={true}
      horizontalSpacing="xl"
      verticalSpacing="xs"
      withTableBorder={false}
      // withColumnBorders={true}
      mt="10"
      miw="1000px"
      style={{ borderColor }}
    >
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header: any) => (
              <th
                key={header.id}
                style={{
                  // padding: "16px",
                  padding: "12px",
                  textAlign: "start",
                  fontWeight: "500",
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.Header ??
                        header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            draggable={
              row.original.children
                ? false
                : isDraggable(row?.original?.item_type)
            }
            onDragStart={(e) => handleDrag(e, row.original)}
            style={{
              cursor:
                isDraggable(row?.original?.item_type) && !row.original.children
                  ? "grab"
                  : "default",
              // backgroundColor: row.original.children ? bgColor : "none",
              // borderBottom: row.original.children ? "none" : `1px solid ${borderColor}`
            }}
            className={tableRowClass}
          >
            {row.getVisibleCells().map((cell: any) => (
              <td
                key={cell.id}
                style={{
                  // backgroundColor: cell.row.original.children
                  //   ? colorScheme === "light"
                  //     ? "lightgray"
                  //     : "rgb(46,46,47)"
                  //   : undefined,
                  // borderStyle: cell.row.original.children && "none",
                  // border: cell.row.original.children ? "" : "1px solid #424242",
                  // padding: cell.row.original.children ? "8px 24px" : "16px",
                  padding: "12px",
                }}
              >
                {flexRender(
                  cell.column.columnDef.Cell ?? cell.column.columnDef.cell,
                  cell.getContext(),
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const MemoizedTableComponent = memo(ItemsTable);
export default MemoizedTableComponent;
