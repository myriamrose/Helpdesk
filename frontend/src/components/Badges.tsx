import { TicketCategory, TicketPriority, TicketStatus } from "../types";

const statusColors: Record<TicketStatus, string> = {
    open: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<TicketStatus, string> = {
    open: "Ouvert",
    in_progress: "En cours",
    resolved: "Résolu",
    closed: "Fermé",
};

const priorityColors: Record<TicketPriority, string> = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-800",
};

const priorityLabels: Record<TicketPriority, string> = {
    low: "Basse",
    medium: "Moyenne",
    high: "Haute",
    critical: "Critique",
};


const priorityDot: Record<TicketPriority, string> = {
    low: "bg-gray-400",
    medium: "bg-blue-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
};

const categoryLabels: Record<TicketCategory, string> = {
    bug: "Bug",
    feature: "Fonctionnalité",
    question: "Question",
    incident: "Incident",
    other: "Autre",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
    );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${priorityColors[priority]}`}
        >
      <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[priority]}`} />
            {priorityLabels[priority]}
    </span>
    );
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
    return (
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
      {categoryLabels[category]}
    </span>
    );
}

export const STATUS_OPTIONS = Object.entries(statusLabels).map(([value, label]) => ({
    value: value as TicketStatus,
    label,
}));

export const PRIORITY_OPTIONS = Object.entries(priorityLabels).map(([value, label]) => ({
    value: value as TicketPriority,
    label,
}));

export const CATEGORY_OPTIONS = Object.entries(categoryLabels).map(([value, label]) => ({
    value: value as TicketCategory,
    label,
}));
