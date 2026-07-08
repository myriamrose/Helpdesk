export function Loading({ label = "Chargement..." }: { label?: string }) {
    return (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            {label}
        </div>
    );
}

export function ErrorMessage({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="mt-2 text-xs font-medium underline hover:text-red-900">
                    Réessayer
                </button>
            )}
        </div>
    );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-gray-800">{title}</p>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
    );
}
