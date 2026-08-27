'use client';
import * as React from 'react';
import { Calendar } from '@ui-registry/calendar';

export function CalendarDemo() {
  // Fecha fija, no `new Date()`: si no, la captura del showcase cambiaría
  // cada día y el PNG saldría distinto en cada `pnpm capture`.
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 8, 15));
  return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />;
}
