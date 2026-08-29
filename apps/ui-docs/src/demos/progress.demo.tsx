'use client';
import { Progress, ProgressLabel, ProgressValue } from '@ui-registry/progress';

export function ProgressDemo() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <Progress value={64}>
        <div className="flex items-baseline justify-between">
          <ProgressLabel>Expediente completado</ProgressLabel>
          <ProgressValue />
        </div>
      </Progress>

      <Progress value={null}>
        <div className="flex items-baseline justify-between">
          <ProgressLabel>Consultando con la aseguradora</ProgressLabel>
          <span className="text-sm text-muted-foreground">sin estimación</span>
        </div>
      </Progress>
    </div>
  );
}
