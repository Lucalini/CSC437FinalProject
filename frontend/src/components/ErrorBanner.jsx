export default function ErrorBanner({ message, onRetry }) {
    return (
        <div className="error-banner" role="alert">
            <p><strong>Error:</strong> {message}</p>
            {onRetry && (
                <button className="btn ghost" onClick={onRetry} type="button">
                    Try again
                </button>
            )}
        </div>
    );
}
