'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@ui-registry/avatar';

export function AvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Lucía Ferrer" />
        <AvatarFallback>LF</AvatarFallback>
      </Avatar>
      <Avatar className="size-10">
        <AvatarImage src="https://i.pravatar.cc/80?img=32" alt="Andrés Pinto" />
        <AvatarFallback>AP</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarFallback>MO</AvatarFallback>
      </Avatar>
    </div>
  );
}
