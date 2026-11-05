"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap page-space">
      <div className="empty">
        <h1>Let’s try that again.</h1>
        <p>
          Something interrupted this page. Your device-local collection is still
          saved.
        </p>
        <button className="btn primary" onClick={reset}>
          Reload this view
        </button>
      </div>
    </div>
  );
}
