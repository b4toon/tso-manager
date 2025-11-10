export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: number
          name: string
          realm: string
          created_at: string
        }
        Insert: {
          id: number
          name: string
          realm: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          realm?: string
          created_at?: string
        }
      }
      explorers_info: {
        Row: {
          id: number
          default_name: string
          explorer_type: number
          explorer_icon: string
          created_at: string
        }
        Insert: {
          id?: number
          default_name: string
          explorer_type: number
          explorer_icon: string
          created_at?: string
        }
        Update: {
          id?: number
          default_name?: string
          explorer_type?: number
          explorer_icon?: string
          created_at?: string
        }
      }
      explorer_players: {
        Row: {
          id: string
          player_id: number
          explorer_type_id: number
          explorer_name: string
          explorer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          player_id: number
          explorer_type_id: number
          explorer_name: string
          explorer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          player_id?: number
          explorer_type_id?: number
          explorer_name?: string
          explorer_id?: string
          created_at?: string
        }
      }
      explorers_actions: {
        Row: {
          action_id: string
          player_id: number
          explorer_id: string
          task_id: number
          subtask_id: number
          task_name: string
          timestamp: string
          return_time: string
          created_at: string
        }
        Insert: {
          action_id?: string
          player_id: number
          explorer_id: string
          task_id: number
          subtask_id: number
          task_name: string
          timestamp: string
          return_time: string
          created_at?: string
        }
        Update: {
          action_id?: string
          player_id?: number
          explorer_id?: string
          task_id?: number
          subtask_id?: number
          task_name?: string
          timestamp?: string
          return_time?: string
          created_at?: string
        }
      }
    }
  }
}

