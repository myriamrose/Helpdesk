import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    fetchTicket,
    fetchComments,
    fetchUsers,
    updateTicket,
    addComment,
    deleteTicket,
    getErrorMessage,
} from "../services/api";
import { Comment, Ticket, User } from "../types";
import { StatusBadge, PriorityBadge, CategoryBadge, STATUS_OPTIONS } from "../components/Badges";
import { Loading, ErrorMessage } from "../components/Feedback";

export function TicketDetailPage() {
    const { id } = useParams<{ id: string }>();
    const ticketId = Number(id);
    const navigate = useNavigate();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const [savingField, setSavingField] = useState<string | null>(null);

    const [commentContent, setCommentContent] = useState("");
    const [commentAuthorId, setCommentAuthorId] = useState<number | "">("");
    const [commentError, setCommentError] = useState<string | null>(null);
    const [postingComment, setPostingComment] = useState(false);

    async function loadTicket() {
        setLoading(true);
        setError(null);
        try {
            const [ticketData, commentsData, usersData] = await Promise.all([
                fetchTicket(ticketId),
                fetchComments(ticketId),
                fetchUsers(),
            ]);
            setTicket(ticketData);
            setComments(commentsData);
            setUsers(usersData);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (Number.isInteger(ticketId)) loadTicket();
    }, [ticketId]);

    async function handleFieldChange(field: "status" | "assignee_id", value: string) {
        if (!ticket) return;
        setSavingField(field);
        try {
            const payload = field === "assignee_id" ? { assignee_id: value ? Number(value) : null } : { status: value as any };
            const updated = await updateTicket(ticket.id, payload);
            setTicket(updated);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSavingField(null);
        }
    }

    async function handleDelete() {
        if (!ticket) return;
        if (!window.confirm("Supprimer définitivement ce ticket ?")) return;
        try {
            await deleteTicket(ticket.id);
            navigate("/tickets");
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    async function handleAddComment(e: React.FormEvent) {
        e.preventDefault();
        setCommentError(null);

        if (!commentContent.trim()) {
            setCommentError("Le commentaire ne peut pas être vide.");
            return;
        }
        if (!commentAuthorId) {
            setCommentError("Sélectionnez un auteur.");
            return;
        }

        setPostingComment(true);
        try {
            const created = await addComment(ticketId, {
                author_id: Number(commentAuthorId),
                content: commentContent.trim(),
            });
            setComments((prev) => [...prev, created]);
            setCommentContent("");
        } catch (err) {
            setCommentError(getErrorMessage(err));
        } finally {
            setPostingComment(false);
        }
    }

    if (loading) return <Loading label="Chargement du ticket..." />;
    if (error && !ticket) return <ErrorMessage message={error} onRetry={loadTicket} />;
    if (!ticket) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Link to="/tickets" className="text-sm text-gray-500 hover:text-blue-600">
                    ← Retour à la liste
                </Link>
                <div className="flex gap-2">
                    <Link
                        to={`/tickets/${ticket.id}/edit`}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Modifier
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="rounded-lg border border-gray-200 bg-white p-6">

                <h1 className="mt-1 text-xl font-bold text-gray-800">{ticket.title}</h1>

                <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                    <CategoryBadge category={ticket.category} />
                </div>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {ticket.description || "Pas de description fournie."}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-3">
                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">Auteur</label>
                        <p className="mt-1 text-sm text-gray-800">{ticket.author?.name ?? "Inconnu"}</p>
                    </div>
                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">Assigné à</label>
                        <select
                            value={ticket.assignee_id ?? ""}
                            disabled={savingField === "assignee_id"}
                            onChange={(e) => handleFieldChange("assignee_id", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Non assigné</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium uppercase tracking-wide text-gray-400">Statut</label>
                        <select
                            value={ticket.status}
                            disabled={savingField === "status"}
                            onChange={(e) => handleFieldChange("status", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            {STATUS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex justify-between text-xs text-gray-400">
                    <span>Créé le {new Date(ticket.created_at).toLocaleString("fr-FR")}</span>
                    <span>Mis à jour le {new Date(ticket.updated_at).toLocaleString("fr-FR")}</span>
                </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-base font-semibold text-gray-800">Commentaires ({comments.length})</h2>

                <div className="mt-4 flex flex-col gap-4">
                    {comments.length === 0 && <p className="text-sm text-gray-400">Aucun commentaire pour le moment.</p>}
                    {comments.map((c) => (
                        <div key={c.id} className="rounded-lg bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-800">{c.author?.name ?? "Utilisateur inconnu"}</span>
                                <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString("fr-FR")}</span>
                            </div>
                            <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">{c.content}</p>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddComment} className="mt-5 flex flex-col gap-3 border-t border-gray-100 pt-5">
                    <select
                        value={commentAuthorId}
                        onChange={(e) => setCommentAuthorId(e.target.value ? Number(e.target.value) : "")}
                        className="w-48 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="">Auteur du commentaire</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Ajouter un commentaire"
                        rows={3}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {commentError && <p className="text-sm text-red-600">{commentError}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={postingComment}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {postingComment ? "Envoi" : "Publier le commentaire"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
