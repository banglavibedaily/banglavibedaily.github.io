export default function BrushLabel({ className = '', children }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-0 -skew-x-6 rounded-[3px] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
      />
      <span className="relative block px-3 py-0.5 text-[#06110C]">{children}</span>
    </span>
  );
}
