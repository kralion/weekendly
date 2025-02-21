export type UserPreferences = {
  user_id: string;
  created_at: string;
  bio: string | null;
  hobbies: string[];
  preferred_activities: string[];
  age_range: number[];
  preferred_days: ("saturday" | "sunday")[];
  preferred_time_ranges: string[]; // Format: "HH:mm" 24-hour format
  preferred_place_types: string[];
};

export type WeekendPlan = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  description: string | null;
  place_type: string;
  preferred_day: "saturday" | "sunday";
  start_time: string; // 24h format HH:mm
  end_time: string; // 24h format HH:mm
  activity_type: string[];
  max_participants: number;
  is_active: boolean;
};

export type MatchStatus = "pending" | "accepted" | "rejected";

export type Match = {
  id: string;
  created_at: string;
  user1_id: string;
  user2_id: string;
  status: MatchStatus;
  plan_id: string | null;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

// Database types for Supabase
export type Tables = {
  user_preferences: UserPreferences;
  weekend_plans: WeekendPlan;
  matches: Match;
  messages: Message;
};

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;

export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;

export type DbResultErr = {
  message: string;
  code: string;
};

// Helper type for form data
export type WeekendPlanFormData = Omit<
  WeekendPlan,
  "id" | "created_at" | "user_id" | "is_active"
>;

// Helper type for user matching
export type MatchCandidate = {
  user_id: string;
  compatibility_score: number;
  shared_interests: string[];
  preferred_activities_match: string[];
  distance: number;
  plan?: WeekendPlan;
};

// Helper type for messaging
export type ChatMessage = Message & {
  is_sender: boolean;
  sender_name?: string;
  sender_avatar?: string;
};
