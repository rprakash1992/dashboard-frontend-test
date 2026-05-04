import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";

//mock data - strongly typed if you are using TypeScript (optional, but recommended)
// const data = [
//   {
//     name: "John",
//     age: 30,
//   },
//   {
//     name: "Sara",
//     age: 25,
//   },
// ];

export const TableComponent = ({ header, rows }: any) => {
  const columns = useMemo(
    () =>
      header.map((col: any) => ({
        accessorKey: col,
        header: col,
        // Header: <strong>{col}</strong>,
      })),
    [header]
  );

  const data = useMemo(
    () =>
      rows.map((row: any) => ({
        [header[0]]: row[0],
        [header[1]]: row[1],
        [header[2]]: row[2],
      })),
    [header, rows]
  );

  // const columns2 = useMemo(
  //   () => [
  //     {
  //       accessorKey: "name", //simple recommended way to define a column
  //       header: "Name",
  //       mantineTableHeadCellProps: { style: { color: "green" } }, //custom props
  //       enableHiding: false, //disable a feature for this column
  //     },
  //     {
  //       accessorFn: (originalRow: any) => originalRow.age, //alternate way
  //       id: "age", //id required if you use accessorFn instead of accessorKey
  //       header: "Age",
  //       Header: <i style={{ color: "red" }}>Age</i>, //optional custom markup
  //     },
  //   ],
  //   []
  // );

  //pass table options to useMantineReactTable
  const table = useMantineReactTable({
    columns,
    data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowSelection: false, //enable some features
    enableColumnOrdering: true, //enable a feature for all columns
    enableGlobalFilter: false, //turn off a feature
    enableBottomToolbar: true,
    enableColumnActions: true,
    enableSorting: false,
    // enableGlobalFilterModes: false,
    // enableGlobalFilter: false,
    enablePagination: true,
    enableFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: true,
    enableHiding: false,
    mantinePaperProps: {
      style: {
        width: "100%",
        maxWidth: "100%",
      },
    },
    mantineTableContainerProps: {
      style: {
        overflowX: "scroll",
      },
    },
  });

  //note: you can also pass table options as props directly to <MantineReactTable /> instead of using useMantineReactTable
  //but the useMantineReactTable hook will be the most recommended way to define table options
  return <MantineReactTable table={table} />;
};
