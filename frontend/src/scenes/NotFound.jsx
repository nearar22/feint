import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-5 px-5 text-center">
      <p className="display text-7xl leading-none tracking-slab text-blood">404</p>
      <p className="display text-xl tracking-slab text-bone-200">No hand at this table</p>
      <p className="mono text-[11px] text-bone-500">The seat you were looking for does not exist.</p>
      <Link to="/" className="btn-blood px-5 py-2.5 text-sm">
        Back to the table
      </Link>
    </div>
  );
}
