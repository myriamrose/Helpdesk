import { Link } from "react-router-dom";
import { Ticket } from "../types";
import { StatusBadge, PriorityBadge, CategoryBadge } from "./Badges";

export function TicketCard({ ticket }: { ticket: Ticket }) {
    return (
        <Link
            to={`/tickets/${ticket.id}`}
            className="block rounded-lg border bg-white p-4 shadow-sm hover:shadow"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate font-semibold text-gray-800">{ticket.title}</h3>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
          {new Date(ticket.updated_at).toLocaleDateString("fr-FR")}
        </span>
            </div>

            <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                {ticket.description || "Pas de description."}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                    <CategoryBadge category={ticket.category} />
                </div>
                <span className="text-xs text-gray-500">
          {ticket.assignee ? `Assigné à ${ticket.assignee.name}` : "Non assigné"}
        </span>
            </div>
        </Link>
    );
}
