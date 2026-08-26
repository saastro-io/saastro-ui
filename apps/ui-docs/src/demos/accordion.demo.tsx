'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@ui-registry/accordion';

export function AccordionDemo() {
  return (
    <Accordion className="w-full max-w-lg">
      <AccordionItem value="a">
        <AccordionTrigger>¿Qué cubre el seguro?</AccordionTrigger>
        <AccordionContent>Daños propios, responsabilidad civil y asistencia en carretera 24h.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>¿Puedo cambiar de plan?</AccordionTrigger>
        <AccordionContent>Sí, en cualquier momento y sin penalización.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
