import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Markup puro: no lleva primitivo. Marca el hueco de lo que está cargando con
 * la forma que va a tener, no con un spinner centrado — la página no salta
 * cuando llegan los datos.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
