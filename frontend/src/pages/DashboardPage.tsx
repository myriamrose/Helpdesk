import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTickets, getErrorMessage } from "../services/api";
import { Ticket, TicketStatus } from "../types";
import { StatusBadge, PriorityBadge } from "../components/Badges";
import { Loading, ErrorMessage } from "../components/Feedback";


export function DashboardPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function loadTickets() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTickets({ sort: "updated_at", order: "desc" });
            setTickets(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTickets();
    }, []);

    if (loading) return <Loading label="Chargement du tableau de bord" />;
    if (error) return <ErrorMessage message={error} onRetry={loadTickets} />;

    const counts = { open: 0, in_progress: 0, resolved: 0, closed: 0 } as Record<TicketStatus, number>;
    for (const t of tickets) {
        counts[t.status]++;
    }

    const criticalCount = tickets.filter((t) => t.priority === "critical" && t.status !== "closed").length;
    const total = tickets.length || 1;
    const lastFive = tickets.slice(0, 5);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
                <p className="mt-1 text-sm text-gray-500">Une vue d'ensemble.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <StatCard label="Ouverts" value={counts.open} tone="text-blue-700 bg-blue-50" />
                <StatCard label="En cours" value={counts.in_progress} tone="text-yellow-700 bg-yellow-50" />
                <StatCard label="Résolus" value={counts.resolved} tone="text-green-700 bg-green-50" />
                <StatCard label="Fermés" value={counts.closed} tone="text-gray-600 bg-gray-100" />
                <StatCard label="Critiques" value={criticalCount} tone="text-red-700 bg-red-50" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                <div className="rounded-lg border border-gray-200 bg-white p-6 lg:col-span-3">
                    <h2 className="text-base font-semibold text-gray-800">Les 5 derniers tickets modifiés</h2>
                    <div className="mt-4 flex flex-col divide-y divide-gray-100">
                        {lastFive.length === 0 && <p className="py-6 text-sm text-gray-400">Aucun ticket pour le moment.</p>}
                        {lastFive.map((ticket) => (
                            <Link
                                key={ticket.id}
                                to={`/tickets/${ticket.id}`}
                                className="flex items-center justify-between gap-3 py-3 text-sm hover:text-blue-600"
                            >
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-gray-800">{ticket.title}</p>
                                    <p className="text-xs text-gray-400">
                                        Mis à jour le {new Date(ticket.updated_at).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <StatusBadge status={ticket.status} />
                                    <PriorityBadge priority={ticket.priority} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
            <p className={`mt-2 inline-flex rounded-lg px-2 py-1 text-2xl font-bold ${tone}`}>{value}</p>
        </div>
    );
}
