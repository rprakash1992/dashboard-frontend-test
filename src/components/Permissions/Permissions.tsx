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
  scope: string;
  field: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

interface PermissionsProps {
  itemId: string;
}

const ALL_ITEM_TYPES = [
  "file",
  "project",
  "report",
  "workspace",
  "user_profile",
  "job",
  "workflow",
  "role",
];

const CRUD_COLUMNS: { key: keyof RolePermission; label: string }[] = [
  { key: "can_create", label: "Create" },
  { key: "can_read", label: "Read" },
  { key: "can_update", label: "Update" },
  { key: "can_delete", label: "Delete" },
];

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

  // Build a lookup: item_type → scope+field key → RolePermission
  const permMap = permissions.reduce<
    Record<string, Record<string, RolePermission>>
  >((acc, perm) => {
    if (!acc[perm.item_type]) acc[perm.item_type] = {};
    acc[perm.item_type][`${perm.scope}:${perm.field}`] = perm;
    return acc;
  }, {});

  // Collect scope+field rows per item_type — only fields that belong to that item_type
  const rowKeysByItemType = permissions.reduce<Record<string, string[]>>(
    (acc, perm) => {
      if (!acc[perm.item_type]) acc[perm.item_type] = [];
      const key = `${perm.scope}:${perm.field}`;
      if (!acc[perm.item_type].includes(key)) acc[perm.item_type].push(key);
      return acc;
    },
    {},
  );

  if (isLoading) return <LoadingComponent />;

  return (
    <MaxWidthContainer>
      <Flex p="xs" direction="column" gap="md">
        <ScrollArea type="auto">
          <Table fz="xs" style={{ minWidth: 480 }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ minWidth: 110 }}>
                  <HeadingTitle title="Item Type" />
                </Table.Th>
                <Table.Th style={{ minWidth: 90 }}>
                  <HeadingTitle title="Scope" />
                </Table.Th>
                <Table.Th style={{ minWidth: 100 }}>
                  <HeadingTitle title="Field" />
                </Table.Th>
                {CRUD_COLUMNS.map((col) => (
                  <Table.Th key={col.key} ta="center" style={{ minWidth: 65 }}>
                    <HeadingTitle title={col.label} />
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {ALL_ITEM_TYPES.map((itemType) => {
                const itemRowKeys = rowKeysByItemType[itemType] ?? [];
                return itemRowKeys.map((rowKey, rowIdx) => {
                  const perm = permMap[itemType]?.[rowKey] ?? null;
                  const [scope, field] = rowKey.split(":");
                  return (
                    <Table.Tr key={`${itemType}-${rowKey}`}>
                      {rowIdx === 0 && (
                        <Table.Td
                          rowSpan={itemRowKeys.length}
                          style={{ verticalAlign: "middle" }}
                        >
                          <Text size="xs" fw={500} tt="capitalize">
                            {itemType.replace(/_/g, " ")}
                          </Text>
                        </Table.Td>
                      )}
                      <Table.Td c={perm ? undefined : "dimmed"} tt="capitalize">
                        {scope}
                      </Table.Td>
                      <Table.Td c={perm ? undefined : "dimmed"} tt="capitalize">
                        {field === "all" ? "∗" : field}
                      </Table.Td>
                      {CRUD_COLUMNS.map((col) => (
                        <Table.Td
                          key={col.key}
                          style={{
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <Checkbox
                            size="xs"
                            checked={perm ? !!perm[col.key] : false}
                            readOnly
                            style={{
                              pointerEvents: "none",
                              display: "flex",
                              justifyContent: "center",
                            }}
                          />
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  );
                });
              })}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Flex>
    </MaxWidthContainer>
  );
};
