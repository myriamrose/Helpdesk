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
}

export interface TicketWithRelations extends Ticket {
  author: User | null;
  assignee: User | null;
}

export interface Comment {
  id: number;
  ticket_id: number;
  author_id: number;
  content: string;
  created_at: string;
}

export interface CommentWithAuthor extends Comment {
  author: User | null;
}
