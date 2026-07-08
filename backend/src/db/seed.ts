import dotenv from "dotenv";
dotenv.config();

import { db, initSchema } from "./index";

initSchema();


db.exec("DELETE FROM comments; DELETE FROM tickets; DELETE FROM users;");
db.exec(
  "DELETE FROM sqlite_sequence WHERE name IN ('comments', 'tickets', 'users');"
);

const insertUser = db.prepare(
  "INSERT INTO users (name, email) VALUES (?, ?)"
);

const users = [
  ["Alice Martin", "alice.martin@helpdesk.com"],
  ["Bruno Costa", "bruno.costa@helpdesk.com"],
  ["Chloé Dubois", "chloe.dubois@helpdesk.com"],
  ["David Nguyen", "david.nguyen@helpdesk.com"],
];

const userIds = users.map(([name, email]) => insertUser.run(name, email).lastInsertRowid as number);

const insertTicket = db.prepare(`
  INSERT INTO tickets (title, description, status, priority, category, author_id, assignee_id, created_at, updated_at)
  VALUES (@title, @description, @status, @priority, @category, @author_id, @assignee_id, @created_at, @updated_at)
`);

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const tickets = [
  {
    title: "Impossible de se connecter à l'application",
    description:
      "Depuis la mise à jour d'hier, la page de connexion affiche une erreur pour tous les utilisateurs du service.",
    status: "open",
    priority: "critical",
    category: "incident",
    author_id: userIds[0],
    assignee_id: userIds[1],
    created_at: daysAgo(1),
    updated_at: daysAgo(0),
  },
  {
    title: "Ajouter un export des tickets",
    description:
      "Ce serait utile de pouvoir exporter la liste des tickets pour les rapports.",
    status: "open",
    priority: "low",
    category: "feature",
    author_id: userIds[2],
    assignee_id: null,
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    title: "Le bouton 'Nouveau ticket' ne répond pas sur mobile",
    description:
      "Le bouton de création de ticket ne déclenche aucune action au premier tap.",
    status: "in_progress",
    priority: "high",
    category: "bug",
    author_id: userIds[1],
    assignee_id: userIds[3],
    created_at: daysAgo(3),
    updated_at: daysAgo(1),
  },
  {
    title: "Question sur les permissions",
    description:
      "Est-ce que n'importe quel utilisateur peut s'assigner un ticket ou faut-il des droits particuliers ?",
    status: "resolved",
    priority: "medium",
    category: "question",
    author_id: userIds[3],
    assignee_id: userIds[0],
    created_at: daysAgo(10),
    updated_at: daysAgo(8),
  },
  {
    title: "Fuite mémoire sur le serveur de rapports",
    description:
      "Le service de génération de rapports consomme de plus en plus de RAM et finit par crasher après ~6h.",
    status: "in_progress",
    priority: "critical",
    category: "bug",
    author_id: userIds[0],
    assignee_id: userIds[2],
    created_at: daysAgo(2),
    updated_at: daysAgo(0),
  },
  {
    title: "Support du mode sombre",
    description:
      "Plusieurs utilisateurs demandent un thème sombre pour l'interface de l'application.",
    status: "open",
    priority: "low",
    category: "feature",
    author_id: userIds[2],
    assignee_id: null,
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
  },
  {
    title: "Erreur de validation lors de la modification d'un ticket",
    description:
      "Le changement du statut d'un ticket déclenche une erreur 'title is required' alors que le titre n'a pas été touché.",
    status: "resolved",
    priority: "high",
    category: "bug",
    author_id: userIds[1],
    assignee_id: userIds[0],
    created_at: daysAgo(6),
    updated_at: daysAgo(4),
  },
];

const ticketIds = tickets.map((t) => insertTicket.run(t).lastInsertRowid as number);

const insertComment = db.prepare(`
  INSERT INTO comments (ticket_id, author_id, content, created_at)
  VALUES (?, ?, ?, ?)
`);

const comments: [number, number, string, string][] = [
  [ticketIds[0], userIds[1], "Je regarde ça immédiatement, ça semble lié au déploiement d'hier soir.", daysAgo(1)],
  [ticketIds[0], userIds[0], "Merci, c'est bloquant pour toute l'équipe ce matin.", daysAgo(0)],
  [ticketIds[2], userIds[3], "Reproduit sur iPhone 13. Je me charge du problème.", daysAgo(2)],
  [ticketIds[3], userIds[0], "Tout utilisateur peut s'auto-assigner un ticket, aucune restriction pour le moment.", daysAgo(8)],
  [ticketIds[4], userIds[2], "Le profiler montre une accumulation d'objets dans le module de génération PDF.", daysAgo(1)],
  [ticketIds[6], userIds[0], "Il doit y avoir une erreur de validation sur les champs transmis, pas l'objet complet.", daysAgo(4)],
];

for (const c of comments) {
  insertComment.run(...c);
}

console.log(`Seed terminé : ${userIds.length} utilisateurs, ${ticketIds.length} tickets, ${comments.length} commentaires.`);
