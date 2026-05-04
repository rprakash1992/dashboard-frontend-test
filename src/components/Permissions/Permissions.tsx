import { useEffect, useState } from "react";
import {
  Checkbox,
  // Divider,
  Flex,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import { useStore } from "../../store";
import { roleApi } from "../../apiActions/roleApi";
import { AlertMsgType } from "../../store/actionSlice";
import { LoadingComponent } from "../LoadingComponent/LoadingComponent";
import { MaxWidthContainer } from "../common/MaxWidthContainer/MaxWidthContainer";

const HeadingTitle = ({ title }: { title: string }) => (
  <Text size="sm" fw={500}>
    {title}
  </Text>
);

interface RolePermission {
  id: string;
  item_type: string;
  action: string;
  sections: string[] | null;
}

interface PermissionsProps {
  itemId: string;
}

const ACTION_LABELS: Record<string, string> = {
  read_items: "Read Items",
  read_metadata: "Read Metadata",
  read_contents: "Read Contents",
  update_metadata: "Update Metadata",
  update_contents: "Update Contents",
  delete: "Delete",
  create: "Create",
};

// Fixed full permission matrix — all item_types and their applicable actions
const ALL_ITEM_TYPES = [
  "file",
  "project",
  "report",
  "workspace",
  "user_profile",
  "job",
  "workflow",
];

const ALL_ACTIONS = [
  "read_items",
  "read_metadata",
  "read_contents",
  "update_metadata",
  "update_contents",
  "delete",
  "create",
];

// "all" is always the first section column, followed by named sections
const SECTION_COLUMNS = ["all", "title", "description", "image", "tags"];

function isSectionChecked(sections: string[] | null, section: string): boolean {
  if (!sections || sections.length === 0) return false;
  const isAll = sections[0] === "*";
  if (section === "all") return isAll;
  return isAll || sections.includes(section);
}

function hasSections(sections: string[] | null): boolean {
  return sections !== null && sections.length > 0;
}

export const Permissions = ({ itemId }: PermissionsProps) => {
  const setDialogBoxMsg = useStore((state) => state.setDialogBoxMsg);
  // const allRoles = useStore((state) => state.allRoles);
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // const role = allRoles.find((r) => r.id === itemId);

  useEffect(() => {
    if (!itemId) return;
    fetchPermissions();
  }, [itemId]);

  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await roleApi.getRolePermissions(itemId);
      if (error) return setDialogBoxMsg(error, AlertMsgType.ERROR);
      setPermissions(data);
    } catch (err) {
      setDialogBoxMsg(String(err), AlertMsgType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  // Build a lookup: item_type → action → RolePermission (or null if not granted)
  const permMap = permissions.reduce<
    Record<string, Record<string, RolePermission>>
  >((acc, perm) => {
    if (!acc[perm.item_type]) acc[perm.item_type] = {};
    acc[perm.item_type][perm.action] = perm;
    return acc;
  }, {});

  if (isLoading) return <LoadingComponent />;

  return (
    <MaxWidthContainer>
      <Flex p="xs" direction="column" gap="md">
        {/* {role && (
          <Box>
            <Text fw={600} size="sm">
              {role.title}
            </Text>
            {role.description && (
              <Text size="xs" c="dimmed">
                {role.description}
              </Text>
            )}
          </Box>
        )} */}

        <ScrollArea type="auto">
          <Table fz="xs" style={{ minWidth: 480 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ minWidth: 110 }}>
                  <HeadingTitle title="Item Type" />
                  {/* Item Type */}
                </Table.Th>
                <Table.Th style={{ minWidth: 130 }}>
                  <HeadingTitle title="Action" />
                  {/* Action */}
                </Table.Th>
                <Table.Th ta="center" style={{ minWidth: 50 }}>
                  <HeadingTitle title="Granted" />
                  {/* Granted */}
                </Table.Th>
                {SECTION_COLUMNS.map((s) => (
                  <Table.Th key={s} ta="center" style={{ minWidth: 72 }}>
                    <HeadingTitle
                      title={s.charAt(0).toUpperCase() + s.slice(1)}
                    />
                    {/* {s.charAt(0).toUpperCase() + s.slice(1)} */}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ALL_ITEM_TYPES.map(
                (
                  itemType,
                  // typeIdx
                ) => (
                  <>
                    {/* {typeIdx > 0 && (
                    <Table.Tr key={`divider-${itemType}`}>
                      <Table.Td colSpan={3 + SECTION_COLUMNS.length} p={0}>
                        <Divider />
                      </Table.Td>
                    </Table.Tr>
                  )} */}
                    {ALL_ACTIONS.map((action, actionIdx) => {
                      const granted = permMap[itemType]?.[action] ?? null;
                      return (
                        <Table.Tr key={`${itemType}-${action}`}>
                          {actionIdx === 0 && (
                            <Table.Td
                              rowSpan={ALL_ACTIONS.length}
                              style={{ verticalAlign: "middle" }}
                            >
                              <Text size="xs" fw={500} tt="capitalize">
                                {itemType.replace(/_/g, " ")}
                              </Text>
                            </Table.Td>
                          )}
                          <Table.Td c={granted ? undefined : "dimmed"}>
                            {ACTION_LABELS[action] ?? action}
                          </Table.Td>
                          <Table.Td
                            style={{
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            <Checkbox
                              size="xs"
                              checked={!!granted}
                              readOnly
                              style={{
                                pointerEvents: "none",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            />
                          </Table.Td>
                          {SECTION_COLUMNS.map((s) => (
                            <Table.Td
                              key={s}
                              style={{
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              {granted && hasSections(granted.sections) ? (
                                <Checkbox
                                  size="xs"
                                  checked={isSectionChecked(
                                    granted.sections,
                                    s,
                                  )}
                                  readOnly
                                  style={{
                                    pointerEvents: "none",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                />
                              ) : (
                                <Text size="xs" c="dimmed">
                                  —
                                </Text>
                              )}
                            </Table.Td>
                          ))}
                        </Table.Tr>
                      );
                    })}
                  </>
                ),
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Flex>
    </MaxWidthContainer>
  );
};
