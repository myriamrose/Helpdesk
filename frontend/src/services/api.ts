import axios from "axios";
import {
  Ticket,
  Comment,
  User,
  TicketFilters,
  CreateTicketInput,
  UpdateTicketInput,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Extracts a readable message from an axios error, falling back to a generic one.
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  return "Une erreur inattendue est survenue.";
}

export async function fetchTickets(filters: TicketFilters = {}): Promise<Ticket[]> {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = String(value);
  });
  const { data } = await api.get<Ticket[]>("/tickets", { params });
  return data;
}

export async function fetchTicket(id: number): Promise<Ticket> {
  const { data } = await api.get<Ticket>(`/tickets/${id}`);
  return data;
}

export async function createTicket(input: CreateTicketInput): Promise<Ticket> {
  const { data } = await api.post<Ticket>("/tickets", input);
  return data;
}

export async function updateTicket(id: number, input: UpdateTicketInput): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}`, input);
  return data;
}

export async function deleteTicket(id: number): Promise<void> {
  await api.delete(`/tickets/${id}`);
}

export async function fetchComments(ticketId: number): Promise<Comment[]> {
  const { data } = await api.get<Comment[]>(`/tickets/${ticketId}/comments`);
  return data;
}

export async function addComment(
  ticketId: number,
  input: { author_id: number; content: string }
): Promise<Comment> {
  const { data } = await api.post<Comment>(`/tickets/${ticketId}/comments`, input);
  return data;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users");
  return data;
}
