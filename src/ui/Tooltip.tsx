import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

export const TooltipProvider = TooltipPrimitive.Provider

export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className = '', sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 px-2.5 py-1.5 text-xs font-medium bg-text-1 text-surface-1 rounded-md shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'

/**
 * Convenience wrapper: <Tooltip content="Label"><button>...</button></Tooltip>
 */
export function Tooltip({
  children,
  content,
  side,
}: {
  children: ReactNode
  content: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </TooltipRoot>
  )
}
