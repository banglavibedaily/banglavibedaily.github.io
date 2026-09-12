export default function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 transition ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
