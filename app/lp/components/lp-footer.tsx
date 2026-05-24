import Link from "next/link";

function DropletIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

/**
 * Minimal footer for landing pages.
 */
export function LPFooter() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <DropletIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">
            Docs Version History
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
        </nav>

        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Docs Version History
        </p>
      </div>
    </footer>
  );
}

export default LPFooter;
