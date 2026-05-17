import { type RawActivity, type DayGroup, type ActivityEntry } from "./types";

const EVENT_TONE: Record<string, ActivityEntry["tone"]> = {
  create: "create",
  update: "move",
  destroy: "delete",
};

const EVENT_ACTION: Record<string, string> = {
  create: "created",
  update: "updated",
  destroy: "deleted",
};

export function to_local_date_string(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}


export function toGroups(activities: RawActivity[]): DayGroup[] {
  const buckets = new Map<string, DayGroup>();

  for (const a of activities) {
    if (!a.entity) continue;
    const date = new Date(a.created_at);
    const key  = date.toDateString();

    if (!buckets.has(key)) {
      buckets.set(key, {
        label: to_local_date_string(date),
        entries: [],
      });
    }

    buckets.get(key)!.entries.push({
      tone:    EVENT_TONE[a.event]   ?? "default",
      actor:   a.whodunnit?.name     ?? "System",
      action:  EVENT_ACTION[a.event] ?? a.event,
      object:  a.entity?.name        ?? `${a.entity_type} #${a.item_id}`,
      metaTag: a.entity_type,
      time:    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    });
  }

  return Array.from(buckets.values());
}
