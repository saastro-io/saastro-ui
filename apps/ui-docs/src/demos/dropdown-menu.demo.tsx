'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@ui-registry/dropdown-menu';
import { Button } from '@ui-registry/button';
import { ChevronDownIcon, DownloadIcon, PencilIcon, SendIcon, Trash2Icon } from 'lucide-react';

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            Póliza ZM-10482
            <ChevronDownIcon data-icon="inline-end" />
          </Button>
        }
      />
      <DropdownMenuContent className="min-w-52">
        {/* El Group no es decorativo: DropdownMenuLabel es Menu.GroupLabel de
            Base UI y lanza si no lo encuentra. En Radix el Label era libre. */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem>
            <PencilIcon />
            Editar datos
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Descargar condiciones
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SendIcon />
            Enviar al tomador
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Anular
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
