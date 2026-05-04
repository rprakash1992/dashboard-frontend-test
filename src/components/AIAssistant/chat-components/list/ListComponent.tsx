import { Box, List, Text } from "@mantine/core";

export const ListComponent = ({ items }: any) => {
  return (
    <Box>
      <List type="ordered">
        {items.map((x: any, i: number) => (
          <List.Item key={i} style={{ textAlign: "left" }}>
            <Text>{x}</Text>
          </List.Item>
        ))}
      </List>
    </Box>
  );
};
