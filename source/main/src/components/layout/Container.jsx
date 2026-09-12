export default function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-content px-4 sm:px-6 ${className}`}>{children}</div>;
}
