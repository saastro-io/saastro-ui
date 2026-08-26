'use client';
import { useForm } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@ui-registry/form';
import { Input } from '@ui-registry/input';
import { Button } from '@ui-registry/button';

export function FormDemo() {
  const form = useForm({ defaultValues: { email: '' } });
  return (
    <form className="w-full max-w-sm space-y-4" onSubmit={form.handleSubmit(() => {})}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input placeholder="tucorreo@email.com" {...field} /></FormControl>
            <FormDescription>Para formularios reales, usa @saastro/forms.</FormDescription>
          </FormItem>
        )}
      />
      <Button type="submit">Enviar</Button>
    </form>
  );
}
