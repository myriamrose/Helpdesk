export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory = "bug" | "feature" | "question" | "incident" | "other";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  author_id: number;
  assignee_id: number | null;
  created_at: string;
  updated_at: string;
  author: User | null;
  assignee: User | null;
}

export interface Comment {
  id: number;
  ticket_id: number;
  author_id: number;
  content: string;
  created_at: string;
  author: User | null;
}

export interface TicketFilters {
  status?: TicketStatus | "";
  priority?: TicketPriority | "";
  category?: TicketCategory | "";
  search?: string;
  sort?: "created_at" | "updated_at" | "priority" | "status";
  order?: "asc" | "desc";
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  author_id: number;
  assignee_id: number | null;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignee_id?: number | null;
}

export interface ApiError {
  error: string;
}
