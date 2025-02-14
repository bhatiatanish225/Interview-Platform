export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  active: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Response {
  id: string;
  user_id: string;
  question_id: string;
  video_url: string;
  attempt_number: number;
  created_at: string;
}

export interface Attempt {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  attempt_number: number;
}