import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchTickets, getErrorMessage } from "../services/api";
import { Ticket, TicketFilters } from "../types";
import { STATUS_OPTIONS, PRIORITY_OPTIONS, CATEGORY_OPTIONS } from "../components/Badges";
import { TicketCard } from "../components/TicketCard";
import { Loading, ErrorMessage, EmptyState } from "../components/Feedback";

export function TicketsListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");

    const filters: TicketFilters = useMemo(
        () => ({
            status: (searchParams.get("status") as TicketFilters["status"]) || "",
            priority: (searchParams.get("priority") as TicketFilters["priority"]) || "",
            category: (searchParams.get("category") as TicketFilters["category"]) || "",
            search: searchParams.get("search") || "",
            sort: (searchParams.get("sort") as TicketFilters["sort"]) || "created_at",
            order: (searchParams.get("order") as TicketFilters["order"]) || "desc",
        }),
        [searchParams]
    );

    async function loadTickets() {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTickets(filters);
            setTickets(data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadTickets();
    }, [searchParams]);

    function updateFilter(key: string, value: string) {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        setSearchParams(next);
    }

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        updateFilter("search", searchInput.trim());
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Tickets</h1>
                <p className="text-sm text-gray-500">
                    {loading ? "Chargement" : `${tickets.length} ticket${tickets.length > 1 ? "s" : ""}`}
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
                <form onSubmit={handleSearchSubmit} className="flex min-w-[220px] flex-1 items-center gap-2">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Rechercher par titre"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="shrink-0 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Rechercher
                    </button>
                </form>

                <select
                    value={filters.status}
                    onChange={(e) => updateFilter("status", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Tous les statuts</option>
                    {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.priority}
                    onChange={(e) => updateFilter("priority", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Toutes les priorités</option>
                    {PRIORITY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                <select
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                    <option value="">Toutes les catégories</option>
                    {CATEGORY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>

                <select
                    value={`${filters.sort}:${filters.order}`}
                    onChange={(e) => {
                        const [sort, order] = e.target.value.split(":");
                        const next = new URLSearchParams(searchParams);
                        next.set("sort", sort);
                        next.set("order", order);
                        setSearchParams(next);
                    }}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                    <option value="created_at:desc">Plus récents</option>
                    <option value="created_at:asc">Plus anciens</option>
                    <option value="priority:desc">Priorité de la hausse à la basse</option>
                    <option value="priority:asc">Priorité de la basse à la hausse</option>
                </select>
            </div>

            {loading && <Loading label="Chargement des tickets" />}
            {!loading && error && <ErrorMessage message={error} onRetry={loadTickets} />}
            {!loading && !error && tickets.length === 0 && (
                <EmptyState
                    title="Aucun ticket ne correspond à ces filtres"
                    description="Essayez d'élargir votre recherche"
                />
            )}
            {!loading && !error && tickets.length > 0 && (
                <div className="flex flex-col gap-3">
                    {tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    );
}
