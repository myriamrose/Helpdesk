import { z } from "zod";

export const ticketStatusEnum = z.enum(["open", "in_progress", "resolved", "closed"]);
export const ticketPriorityEnum = z.enum(["low", "medium", "high", "critical"]);
export const ticketCategoryEnum = z.enum(["bug", "feature", "question", "incident", "other"]);

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "title is required").max(200),
  description: z.string().trim().max(5000).optional().default(""),
  priority: ticketPriorityEnum.optional().default("medium"),
  category: ticketCategoryEnum.optional().default("other"),
  author_id: z.number({ invalid_type_error: "author_id must be a number" }).int().positive("author_id is required"),
  assignee_id: z.number().int().positive().nullable().optional(),
});

export const updateTicketSchema = z
  .object({
    title: z.string().trim().min(1, "title cannot be empty").max(200),
    description: z.string().trim().max(5000),
    status: ticketStatusEnum,
    priority: ticketPriorityEnum,
    category: ticketCategoryEnum,
    assignee_id: z.number().int().positive().nullable(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "at least one field must be provided",
  });

export const createCommentSchema = z.object({
  author_id: z.number({ invalid_type_error: "author_id must be a number" }).int().positive("author_id is required"),
  content: z.string().trim().min(1, "content is required").max(3000),
});

export const ticketFiltersSchema = z.object({
  status: ticketStatusEnum.optional(),
  priority: ticketPriorityEnum.optional(),
  category: ticketCategoryEnum.optional(),
  search: z.string().trim().optional(),
  sort: z.enum(["created_at", "priority", "status", "updated_at"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
