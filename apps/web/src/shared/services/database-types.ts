/**
 * Supabase가 만들어 준 표 타입입니다.
 * 표나 함수가 바뀌면 Supabase에서 타입을 다시 뽑아 `Database`를 통째로 바꿉니다.
 * 생성 결과에 딸려 오는 도우미 타입(`Tables` 등)은 쓰지 않아 뺐습니다.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          photo_id: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          photo_id: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          photo_id?: string;
          updated_at?: string | null;
          user_id?: string;
        };
      };
      group_members: {
        Row: {
          group_id: string;
          id: string;
          joined_at: string | null;
          nickname: string | null;
          role: string;
          user_id: string;
        };
        Insert: {
          group_id: string;
          id?: string;
          joined_at?: string | null;
          nickname?: string | null;
          role?: string;
          user_id: string;
        };
        Update: {
          group_id?: string;
          id?: string;
          joined_at?: string | null;
          nickname?: string | null;
          role?: string;
          user_id?: string;
        };
      };
      groups: {
        Row: {
          created_at: string | null;
          created_by: string;
          id: string;
          invite_code: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          created_by: string;
          id?: string;
          invite_code: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          created_by?: string;
          id?: string;
          invite_code?: string;
          name?: string;
        };
      };
      missions: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          keyword: string;
          mission_date: string;
          round: number;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          keyword: string;
          mission_date: string;
          round?: number;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          keyword?: string;
          mission_date?: string;
          round?: number;
        };
      };
      photos: {
        Row: {
          caption: string | null;
          created_at: string | null;
          group_id: string;
          id: string;
          image_path: string;
          mission_id: string;
          user_id: string;
        };
        Insert: {
          caption?: string | null;
          created_at?: string | null;
          group_id: string;
          id?: string;
          image_path: string;
          mission_id: string;
          user_id: string;
        };
        Update: {
          caption?: string | null;
          created_at?: string | null;
          group_id?: string;
          id?: string;
          image_path?: string;
          mission_id?: string;
          user_id?: string;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          id: string;
          name: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          id?: string;
          name?: string;
        };
      };
      reactions: {
        Row: {
          created_at: string | null;
          emoji: string;
          id: string;
          photo_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          emoji: string;
          id?: string;
          photo_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          emoji?: string;
          id?: string;
          photo_id?: string;
          user_id?: string;
        };
      };
      ut_settings: {
        Row: {
          active_round: number;
          id: boolean;
          updated_at: string;
        };
        Insert: {
          active_round?: number;
          id?: boolean;
          updated_at?: string;
        };
        Update: {
          active_round?: number;
          id?: boolean;
          updated_at?: string;
        };
      };
    };
    Functions: {
      are_group_peers: {
        Args: { target_user_a: string; target_user_b: string };
        Returns: boolean;
      };
      create_group: { Args: { group_name: string }; Returns: Json };
      is_group_creator: {
        Args: { target_group_id: string; target_user_id?: string };
        Returns: boolean;
      };
      is_group_member: {
        Args: { target_group_id: string; target_user_id?: string };
        Returns: boolean;
      };
      is_group_owner: {
        Args: { target_group_id: string; target_user_id?: string };
        Returns: boolean;
      };
      join_group: { Args: { input_invite_code: string }; Returns: Json };
      switch_mission_round: { Args: never; Returns: number };
    };
  };
};

/** 표 이름으로 그 표의 한 줄 모양을 꺼냅니다. */
export type TableRow<Name extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][Name]['Row'];

/** 표 이름으로 그 표에 넣을 때의 모양을 꺼냅니다. */
export type TableInsert<Name extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][Name]['Insert'];
