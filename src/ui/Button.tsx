import { forwardRef, type ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'default' | 'ghost' | 'accent'
type ButtonSize = 'sm' | 'md' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-surface-2 text-text-1 border border-border-1 hover:bg-surface-3 hover:border-border-2',
  ghost:
    'text-text-2 hover:bg-surface-2 hover:text-text-1',
  accent:
    'bg-accent text-accent-text hover:bg-accent-hover',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-8 px-3 text-sm gap-2',
  icon: 'h-8 w-8 justify-center',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center font-medium rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
