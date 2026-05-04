import { Box, Radio, TextInput } from "@mantine/core";

interface GroupDetailsProps {
  groupTitle: string;
  groupOperator: string;
  setGroupTitle: (title: string) => void;
  setGroupOperator: (val: string) => void;
}

export const GroupDetails = ({
  groupTitle,
  groupOperator,
  setGroupTitle,
  setGroupOperator,
}: GroupDetailsProps) => {
  return (
    <Box>
      <TextInput
        mb="10px"
        label="Group Title:"
        placeholder="Enter group title..."
        value={groupTitle}
        onChange={(e) => setGroupTitle(e.target.value)}
      />
      <Radio.Group
        mb="10px"
        value={groupOperator}
        onChange={setGroupOperator}
        label="Group Operator:"
      >
        <Box style={{ display: "flex", flexDirection: "row" }}>
          <Radio p="xs" value="All" label="All" />
          <Radio p="xs" value="Any" label="Any" />
        </Box>
      </Radio.Group>
    </Box>
  );
};
