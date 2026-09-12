const VARIANTS = {
  primary: 'bg-red text-white hover:brightness-110',
  secondary: 'border border-border bg-surface text-body hover:border-green',
  ghost: 'text-body hover:text-red',
};

export default function Button({
  href,
  variant = 'primary',
  className = '',
  icon: Icon,
  children,
  ...rest
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3',
    'font-display text-sm font-bold uppercase tracking-wider transition',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green',
    VARIANTS[variant] ?? VARIANTS.primary,
    className,
  ].join(' ');

  const content = (
    <>
      {Icon && <Icon aria-hidden="true" className="text-base" />}
      {children}
    </>
  );

  if (href) {
    const external = /^https?:/i.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
