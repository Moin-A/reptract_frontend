import type { Dispatch, SetStateAction } from "react";

export function deleteOpp<T extends { id: number }>(
  id: number,
  setter: Dispatch<SetStateAction<T[]>>,
  message = "Delete this opportunity?"
) {
  if (!confirm(message)) return;
  setter(prev => prev.filter(item => item.id !== id));
}
