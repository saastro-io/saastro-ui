#!/bin/bash
# .claude/hooks/proteger.sh
# Este script revisa cada comando antes de que Claude lo ejecute

COMMAND=$(echo "$TOOL_INPUT" | jq -r '.command')

# Si el comando tiene "rm -rf", lo bloqueamos
if echo "$COMMAND" | grep -q 'rm -rf'; then
  echo "Comando peligroso bloqueado: $COMMAND" >&2
  exit 2  # Exit 2 = BLOQUEAR
fi

# Si el comando tiene "drop table", lo bloqueamos
if echo "$COMMAND" | grep -qi 'drop table'; then
  echo "Operación de base de datos bloqueada" >&2
  exit 2
fi

# Todo lo demás, permitir
exit 0  # Exit 0 = PERMITIR