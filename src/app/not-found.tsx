import Link from "next/link";
export default function NotFound() {
  return (
    <div className="wrap page-space">
      <div className="empty">
        <h1>A path less travelled.</h1>
        <p>
          We could not find that product or page. There are plenty of thoughtful
          choices to explore.
        </p>
        <Link href="/products" className="btn primary">
          Back to the catalog
        </Link>
      </div>
    </div>
  );
}
