export default function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="loading-spinner" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>{message}</p>
        </div>
    );
}
