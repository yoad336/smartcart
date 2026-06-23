/* Reusable component — used across many pages.
   variant: 'primary' | 'secondary' | 'ghost' | 'danger'  */

export default function Button({
  children,
  variant = 'primary',
  block = false,
  small = false,
  type = 'button',
  ...rest
}) {
  const className = [
    'btn',
    `btn--${variant}`,
    block ? 'btn--block' : '',
    small ? 'btn--sm' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={className} {...rest}>
      {children}
    </button>
  )
}
