export default function Loading() {
  return (
    <div className="wrap page-space" aria-label="Loading page">
      <div className="skeleton" style={{ height: 180, marginBottom: 24 }} />
      <div className="product-grid">
        {[1, 2, 3, 4].map((n) => (
          <div className="skeleton" key={n} />
        ))}
      </div>
    </div>
  );
}
