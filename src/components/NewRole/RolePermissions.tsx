import { Box, Checkbox, ScrollArea, Table, Text } from "@mantine/core";
import { Label } from "../common/Label/Label";

const HeadingTitle = ({ title }: { title: string }) => (
  <Text size="sm" fw={500}>
    {title}
  </Text>
);

export interface RolePermission {
  item_type: string;
  scope: string;
  field: string;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

const CRUD_COLUMNS: { key: keyof RolePermission; label: string }[] = [
  { key: "can_create", label: "Create" },
  { key: "can_read", label: "Read" },
  { key: "can_update", label: "Update" },
  { key: "can_delete", label: "Delete" },
];

const DEFAULT_PERMISSIONS: RolePermission[] = [
  // file
  {
    item_type: "file",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "file",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "file",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "file",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "file",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "file",
    scope: "content",
    field: "url",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  // project
  {
    item_type: "project",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "project",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "project",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "project",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "project",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  // report
  {
    item_type: "report",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "report",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "report",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "report",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "report",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  // workspace
  {
    item_type: "workspace",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workspace",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workspace",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workspace",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workspace",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  // user_profile
  {
    item_type: "user_profile",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "user_profile",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "user_profile",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "user_profile",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "user_profile",
    scope: "content",
    field: "status",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "user_profile",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  // job
  {
    item_type: "job",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "job",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "job",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "job",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "job",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  // workflow
  {
    item_type: "workflow",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workflow",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workflow",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workflow",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "workflow",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  // role
  {
    item_type: "role",
    scope: "metadata",
    field: "title",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "role",
    scope: "metadata",
    field: "description",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "role",
    scope: "metadata",
    field: "image",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "role",
    scope: "metadata",
    field: "tags",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
  {
    item_type: "role",
    scope: "content",
    field: "all",
    can_create: false,
    can_read: false,
    can_update: false,
    can_delete: false,
  },
];

interface RolePermissionsProps {
  permissions: RolePermission[];
  onChange: (permissions: RolePermission[]) => void;
}

export const RolePermissions = ({
  permissions,
  onChange,
}: RolePermissionsProps) => {
  const toggle = (
    item_type: string,
    scope: string,
    field: string,
    col: keyof RolePermission,
  ) => {
    onChange(
      permissions.map((p) =>
        p.item_type === item_type && p.scope === scope && p.field === field
          ? { ...p, [col]: !p[col] }
          : p,
      ),
    );
  };

  // Group rows by item_type in insertion order
  const rowKeysByItemType = permissions.reduce<Record<string, string[]>>(
    (acc, p) => {
      if (!acc[p.item_type]) acc[p.item_type] = [];
      const key = `${p.scope}:${p.field}`;
      if (!acc[p.item_type].includes(key)) acc[p.item_type].push(key);
      return acc;
    },
    {},
  );

  const permMap = permissions.reduce<
    Record<string, Record<string, RolePermission>>
  >((acc, p) => {
    if (!acc[p.item_type]) acc[p.item_type] = {};
    acc[p.item_type][`${p.scope}:${p.field}`] = p;
    return acc;
  }, {});

  const itemTypes = Object.keys(rowKeysByItemType);

  return (
    <Box>
      <Label label="Permissions" />
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
            {itemTypes.map((itemType) => {
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
                    <Table.Td tt="capitalize">{scope}</Table.Td>
                    <Table.Td tt="capitalize">
                      {field === "all" ? "∗" : field}
                    </Table.Td>
                    {CRUD_COLUMNS.map((col) => (
                      <Table.Td
                        key={col.key}
                        style={{ textAlign: "center", verticalAlign: "middle" }}
                      >
                        <Checkbox
                          size="xs"
                          checked={perm ? !!perm[col.key] : false}
                          onChange={() =>
                            perm && toggle(itemType, scope, field, col.key)
                          }
                          style={{
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
    </Box>
  );
};

export { DEFAULT_PERMISSIONS };
