export function ArrowUpIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5.5" />
      <path d="m5.75 11.25 6.25-5.75 6.25 5.75" />
    </svg>
  );
}
