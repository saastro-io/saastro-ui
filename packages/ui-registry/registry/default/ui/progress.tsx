"use client"

import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

/**
 * `value={null}` es indeterminado en Base UI —no existe el modo aparte de
 * Radix—: la barra se pinta a rayas y no se mueve sola, que es lo honrado
 * cuando no se sabe cuánto falta.
 */
function Progress({
  className,
  children,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {children}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full bg-primary transition-all duration-300 ease-out data-[indeterminate]:w-full data-[indeterminate]:bg-transparent data-[indeterminate]:bg-[repeating-linear-gradient(45deg,var(--primary)_0_5px,transparent_5px_10px)] data-[indeterminate]:opacity-30"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      data-slot="progress-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      data-slot="progress-value"
      className={cn("text-sm tabular-nums text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Progress, ProgressLabel, ProgressValue }
