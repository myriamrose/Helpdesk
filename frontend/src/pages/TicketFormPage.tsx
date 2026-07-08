import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    createTicket,
    fetchTicket,
    fetchUsers,
    updateTicket,
    getErrorMessage,
} from "../services/api";
import { TicketCategory, TicketPriority, User } from "../types";
import { PRIORITY_OPTIONS, CATEGORY_OPTIONS } from "../components/Badges";
import { Loading, ErrorMessage } from "../components/Feedback";

interface FormState {
    title: string;
    description: string;
    priority: TicketPriority;
    category: TicketCategory;
    author_id: string;
    assignee_id: string;
}

const emptyForm: FormState = {
    title: "",
    description: "",
    priority: "medium",
    category: "other",
    author_id: "",
    assignee_id: "",
};

export function TicketFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);
    const ticketId = Number(id);
    const navigate = useNavigate();

    const [form, setForm] = useState<FormState>(emptyForm);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadFormData() {
            setLoading(true);
            setError(null);
            try {
                const userList = await fetchUsers();
                setUsers(userList);

                if (isEdit && Number.isInteger(ticketId)) {
                    const ticket = await fetchTicket(ticketId);
                    setForm({
                        title: ticket.title,
                        description: ticket.description,
                        priority: ticket.priority,
                        category: ticket.category,
                        author_id: String(ticket.author_id),
                        assignee_id: ticket.assignee_id ? String(ticket.assignee_id) : "",
                    });
                }
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        }
        loadFormData();
    }, [isEdit, ticketId]);

    function validate(): boolean {
        const errors: Record<string, string> = {};
        if (!form.title.trim()) errors.title = "Le titre est obligatoire.";
        if (!isEdit && !form.author_id) errors.author_id = "Sélectionnez un auteur.";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!validate()) return;

        setSubmitting(true);
        try {
            if (isEdit) {
                const updated = await updateTicket(ticketId, {
                    title: form.title.trim(),
                    description: form.description.trim(),
                    priority: form.priority,
                    category: form.category,
                    assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
                });
                navigate(`/tickets/${updated.id}`);
            } else {
                const created = await createTicket({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    priority: form.priority,
                    category: form.category,
                    author_id: Number(form.author_id),
                    assignee_id: form.assignee_id ? Number(form.assignee_id) : null,
                });
                navigate(`/tickets/${created.id}`);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <Loading label="Chargement du formulaire" />;

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold text-gray-800">{isEdit ? "Modifier le ticket" : "Nouveau ticket"}</h1>
            <p className="mt-1 text-sm text-gray-500">
                {isEdit
                    ? "Mettez à jour les informations du ticket."
                    : "Décrivez le problème ou la demande le plus précisément possible."}
            </p>

            {error && (
                <div className="mt-4">
                    <ErrorMessage message={error} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5 rounded-lg border border-gray-200 bg-white p-6">
                <div>
                    <label className="text-sm font-medium text-gray-800">Titre *</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Ex: Impossible de se connecter"
                        className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                    {fieldErrors.title && <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-800">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        rows={5}
                        placeholder="Donnez le détail de votre problème"
                        className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-800">Priorité</label>
                        <select
                            value={form.priority}
                            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TicketPriority }))}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            {PRIORITY_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-800">Catégorie</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as TicketCategory }))}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            {CATEGORY_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-800">Auteur {!isEdit && "*"}</label>
                        <select
                            value={form.author_id}
                            disabled={isEdit}
                            onChange={(e) => setForm((f) => ({ ...f, author_id: e.target.value }))}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                        >
                            <option value="">Sélectionner</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.author_id && <p className="mt-1 text-xs text-red-600">{fieldErrors.author_id}</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-800">Assigné à</label>
                        <select
                            value={form.assignee_id}
                            onChange={(e) => setForm((f) => ({ ...f, assignee_id: e.target.value }))}
                            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Non assigné</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {submitting ? "Enregistrement" : isEdit ? "Enregistrer" : "Créer le ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
}
