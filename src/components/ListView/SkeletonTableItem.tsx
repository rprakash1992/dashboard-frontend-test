import { Box, Flex, Skeleton } from "@mantine/core";

export const SkeletonTableItem = ({
  row,
  tableRowClass,
}: {
  row: any;
  tableRowClass: any;
}) => (
  <tr className={tableRowClass}>
    {row.getVisibleCells().map((cell: any) => (
      <td
        key={cell.id}
        style={{
          padding: "12px",
        }}
      >
        <Flex gap="xs">
          <Box w="30%">
            <Skeleton height={20} w="100%" />
          </Box>
          <Flex w="70%" gap="xs">
            <Skeleton height={20} w={20} />
          </Flex>
        </Flex>
      </td>
    ))}
  </tr>
);
