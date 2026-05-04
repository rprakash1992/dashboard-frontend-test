import { WorkspaceUsers } from "./WorkspaceUsers";

interface UsersProps {
  itemId: string;
}

const Users = ({ itemId }: UsersProps) => {
  return <WorkspaceUsers itemId={itemId} />;
};

export default Users;
