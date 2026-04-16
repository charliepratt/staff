import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className = '', sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 min-w-[180px] bg-surface-1 border border-border-1 rounded-lg shadow-lg py-1 animate-in fade-in-0 zoom-in-95 ${className}`}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className = '', ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={`flex items-center px-3 py-1.5 text-sm text-text-1 outline-none cursor-pointer transition-colors data-[highlighted]:bg-surface-2 data-[highlighted]:text-text-1 ${className}`}
    {...props}
  />
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className = '', ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-3 ${className}`}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className = '', ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={`h-px my-1 bg-border-1 ${className}`}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'
