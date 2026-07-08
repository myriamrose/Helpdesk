import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div className="min-h-full">
            <header className="border-b bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <span className="text-lg font-bold text-gray-800">Help Desk</span>

                    <nav className="flex items-center gap-1">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `rounded px-3 py-2 text-sm font-medium ${
                                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            Tableau de bord
                        </NavLink>
                        <NavLink
                            to="/tickets"
                            className={({ isActive }) =>
                                `rounded px-3 py-2 text-sm font-medium ${
                                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            Tickets
                        </NavLink>
                        <NavLink to="/tickets/new" className="ml-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                            Nouveau ticket
                        </NavLink>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}
