'use client';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@ui-registry/navigation-menu';

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {[['Inicio','/'],['Servicios','/servicios'],['Contacto','/contacto']].map(([l,h]) => (
          <NavigationMenuItem key={h}>
            <NavigationMenuLink render={<a href={h}>{l}</a>} />
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
