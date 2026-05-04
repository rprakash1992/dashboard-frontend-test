// item
export const ItemTypeEnum = {
  FILE: "file",
  PROJECT: "project",
  REPORT: "report",
  WORKSPACE: "workspace",
  USERPROFILE: "user_profile",
  ROLE: "role",
  JOB: "job",
  WORKFLOW: "workflow",
};

export type ItemType =
  | "file"
  | "project"
  | "report"
  | "workspace"
  | "user_profile"
  | "role"
  | "job"
  | "workflow";

// export type ItemType = (typeof ItemTypeEnum)[keyof typeof ItemTypeEnum];
// export type ItemType = keyof typeof ItemTypeEnum;

export interface ItemsToDisplayType {
  id: string;
  title: string;
  children: ItemMetadataType[];
}

export interface ItemMetadataType {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  item_type: string;
  created_at: string;
  last_modified_at: string | null;
  deleted_at: string | null;
  system_key: string | null;
}

export interface TableColumnType {
  uniqId: string;
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  item_type: string;
  created_at: string;
  deleted_at: string;
  last_modified_at: string;
  system_key: string | null;
  selection?: string;
  children?: any;
}

// file
export interface File {
  id: string;
  url: string;
  downloader_type: string | null;
  downloader_args: Record<string, any> | null;
  cache_state: string | null;
  local_cache_file_path: string | null;
  mime_type: string | null;
  is_uploaded: boolean | null;
  parent: string;
}

// job
export interface Job {
  id: string;
  job_type: JobType;
  total_steps: string | null;
  completed_steps: string | null;
  run_id: string | null;
  run_details: RunDetails;
  output_item_id: string | null;
}

export type JobType =
  | "workflow_run"
  | "zip_to_folder"
  | "folder_to_zip"
  | "zip_to_workflow";
export const JobTypeEnum = {
  WORKFLOW_RUN: "workflow_run",
  ZIP_TO_FOLDER: "zip_to_folder",
  FOLDER_TO_ZIP: "folder_to_zip",
  ZIP_TO_WORKFLOW: "zip_to_workflow",
};

// export type JobType = keyof typeof JobTypeEnum;

export type RunDetailsPhaseType = "Running" | "Failed" | "Succeeded";
export const RunDetailsPhaseEnum = {
  RUNNING: "Running",
  FAILED: "Failed",
  SUCCEEDED: "Succeeded",
};

// export type RunDetailsPhaseEnum =
//   (typeof RunDetailsPhases)[keyof typeof RunDetailsPhases];

interface RunDetails {
  id: string;
  name: string;
  created_at: string;
  start_time: string;
  endTime: string | null;
  phase: RunDetailsPhaseType;
}
