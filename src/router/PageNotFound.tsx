import { Box, Text } from "@mantine/core";

export const PageNotFound = () => {
  return (
    <Box
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Text c="#ffdddd" style={{ fontSize: "60px", fontWeight: "bold" }}>
        404, Not Found
      </Text>
      <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
        The page you are looking for does not exist.
      </Text>
    </Box>
  );
};
