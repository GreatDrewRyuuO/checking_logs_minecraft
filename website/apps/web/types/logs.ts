export type LogType =
  | "entity_death"
  | "player_death"
  | "block_break"
  | "block_place"
  | "chat"
  | "command"
  | "container_open"
  | "item_drop"
  | "item_pickup"
  | "player_join"
  | "player_quit"
  | "sign_text"
  | "bucket_fill"
  | "bucket_empty"
  | "explosion"
  | string;

export interface EntityDeathData {
  entity_type: string;
  location_world: string;
  location_x: number;
  location_y: number;
  location_z: number;
  dropped_exp?: number;
  killer_uuid?: string;
  killer_name?: string;
}

export interface PlayerDeathData {
  player_uuid: string;
  player_name: string;
  death_message?: string;
  location_world: string;
  location_x: number;
  location_y: number;
  location_z: number;
  killer_uuid?: string;
  killer_name?: string;
}

export interface BlockData {
  block_type: string;
  location_world: string;
  location_x: number;
  location_y: number;
  location_z: number;
  player_uuid?: string;
  player_name?: string;
}

export interface ChatData {
  player_uuid: string;
  player_name: string;
  message: string;
}

export type LogData =
  | EntityDeathData
  | PlayerDeathData
  | BlockData
  | ChatData
  | Record<string, unknown>;

export interface LogEntry {
  id: number;
  log_type: LogType;
  timestamp: number;
  is_archived: 0 | 1;
  expires_at: number;
  data: LogData;
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LogsQueryParams {
  page?: number;
  pageSize?: number;
  log_type?: string;
  search?: string;
  from?: number;
  to?: number;
  is_archived?: boolean;
  entity_type?: string;
}
