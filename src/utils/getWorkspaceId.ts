export function getWorkspaceId() {
  const ws = localStorage.getItem("vc-dashboard-workspace");
  const workspace = JSON.parse(ws ?? "{}");

  return workspace.id;
}
// export function getWorkspaceId() {
//   let workspaceId = null;
//   const ws = localStorage.getItem("vc-dashboard-workspace");
//   const workspace = JSON.parse(ws ?? "{}");
//   workspaceId = workspace.id;

//   return workspaceId;
// }
