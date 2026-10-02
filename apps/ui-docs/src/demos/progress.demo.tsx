"use client";
import { Progress, ProgressLabel, ProgressValue } from "@ui-registry/progress";

export function ProgressDemo() {
  return (
    <div className="w-full max-w-sm space-y-6">
      {/* `locale` explícito o no hidrata: ProgressValue formatea con Intl y el
          SSR corre en Node (en-US, «64%») mientras el visitante puede estar en
          es-ES («64 %», con espacio duro). React tira el árbol entero (#418). */}
      <Progress value={64} locale="es-ES">
        <div className="flex items-baseline justify-between">
          <ProgressLabel>Expediente completado</ProgressLabel>
          <ProgressValue />
        </div>
      </Progress>

      <Progress value={null} locale="es-ES">
        <div className="flex items-baseline justify-between">
          <ProgressLabel>Consultando con la aseguradora</ProgressLabel>
          <span className="text-sm text-muted-foreground">sin estimación</span>
        </div>
      </Progress>
    </div>
  );
}
