'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui-registry/tooltip';
import { Button } from '@ui-registry/button';

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Pasa el ratón</Button>} />
        <TooltipContent>La franquicia es de 300 €</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
