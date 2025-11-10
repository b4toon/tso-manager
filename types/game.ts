export interface GameTaskPayload {
  event_type: 'task_sent';
  player_nick: string;
  player_id: number;
  realm: string;
  explorer_id: string;
  explorer_name: string;
  explorer_type: number;
  explorer_icon: string;
  status: 'sent';
  task_id: number;
  sub_task_id: number;
  task_name: string;
  return_time: string;
  remaining_time_ms: number;
}

