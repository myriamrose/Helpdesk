import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { TicketsListPage } from "./pages/TicketsListPage";
import { TicketDetailPage } from "./pages/TicketDetailPage";
import { TicketFormPage } from "./pages/TicketFormPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsListPage />} />
        <Route path="tickets/new" element={<TicketFormPage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="tickets/:id/edit" element={<TicketFormPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="font-display text-xl font-semibold text-ink">Page introuvable</p>
      <p className="mt-1 text-sm text-slate-500">Cette page n'existe pas.</p>
    </div>
  );
}
