export type Role = "assistant" | "user";

interface TableData {
  headers: string[];
  rows: (string | number | boolean | null)[][];
}

interface ChartDataset {
  label?: string;
  data: number[];
  backgroundColor?: string[];
}

interface ChartPayload {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartData {
  type: "line" | "bar" | "pie";
  data: ChartPayload;
}

interface TextPart {
  type: "text";
  data: string;
}

interface TablePart {
  type: "table";
  data: TableData;
}

interface ListPart {
  type: "list";
  data: string[];
}

export interface ImagePart {
  type: "image";
  data: string;
}

interface VideoPart {
  type: "video";
  data: string;
}

interface ChartPart {
  type: "chart";
  data: ChartData;
}

interface HtmlPart {
  type: "html";
  data: string;
}

interface WcaxPart {
  type: "wcax";
  data: string;
}

export type Part =
  | TextPart
  | ImagePart
  | VideoPart
  | ChartPart
  | HtmlPart
  | WcaxPart
  | TablePart
  | ListPart;

export type MessageContentPartType =
  | "text"
  | "image"
  | "video"
  | "chart"
  | "html"
  | "wcax"
  | "table"
  | "list";

export interface MessageContentPart {
  type: MessageContentPartType;
  data: any;
}

export interface Suggestion {
  title: string;
  description: string;
}

export interface MessageContent {
  parts: Part[];
  suggestions: Suggestion[];
}

// export interface MessageContent {
//   parts: Part[];
//   suggestions: string[];
// }

// export interface MessageContent {
//   parts: MessageContentPart[];
//   suggestions: string[];
// }

export interface Message {
  id: string;
  role: Role;
  relevant: boolean | null;
  content: MessageContent;
}
