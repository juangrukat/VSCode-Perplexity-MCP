export interface HistorySource {
  n: number;
  title: string;
  url: string;
  snippet?: string;
}

export interface HistoryAttachment {
  filename: string;
  relPath: string;
  mimeType?: string;
  sizeBytes?: number;
  kind?: string;
}

export type HistoryStatus = "completed" | "pending" | "failed";
export type HistoryTier = "free" | "pro" | "max" | "enterprise" | string;

export interface HistoryItem {
  id: string;
  tool: string;
  query: string;
  model?: string | null;
  mode?: string | null;
  language?: string | null;
  createdAt: string;
  answerPreview: string;
  sourceCount: number;
  threadUrl?: string;
  status?: HistoryStatus;
  completedAt?: string;
  tier?: HistoryTier;
  threadSlug?: string | null;
  backendUuid?: string | null;
  readWriteToken?: string | null;
  sources?: HistorySource[];
  attachments?: HistoryAttachment[];
  tags?: string[];
  pinned?: boolean;
  source?: string;
  cloudHydratedAt?: string;
  error?: string;
}

export interface HistoryEntryDetail extends HistoryItem {
  body: string;
  mdPath: string;
  attachmentsDir: string;
}

export interface ExternalViewer {
  id: string;
  label: string;
  urlTemplate: string;
  needsVaultBridge?: boolean;
  detected?: boolean;
  enabled?: boolean;
  vaultPath?: string;
  vaultName?: string;
  graphName?: string;
}
