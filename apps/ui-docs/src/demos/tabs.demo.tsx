'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui-registry/tabs';

export function TabsDemo() {
  return (
    <Tabs defaultValue="coberturas" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="coberturas">Coberturas</TabsTrigger>
        <TabsTrigger value="recibos">Recibos</TabsTrigger>
        <TabsTrigger value="partes">Partes</TabsTrigger>
      </TabsList>
      <TabsContent value="coberturas" className="pt-1 text-sm text-muted-foreground">
        Daños propios, responsabilidad civil, asistencia 24h y vehículo de sustitución.
      </TabsContent>
      <TabsContent value="recibos" className="pt-1 text-sm text-muted-foreground">
        Último cobro el 3 de febrero. Domiciliado, sin devoluciones.
      </TabsContent>
      <TabsContent value="partes" className="pt-1 text-sm text-muted-foreground">
        Ninguno abierto en los últimos doce meses.
      </TabsContent>
    </Tabs>
  );
}
