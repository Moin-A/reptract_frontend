import { Plus } from "lucide-react";
import { IconToggleButton } from "@/components/atoms/IconToggleButton";
import { PrimaryButton } from "@/components/atoms/PrimaryButton";
import { ListIcon, GridIcon } from "@/components/atoms/icons";

const VIEWS = [
  { v: "list", title: "List view",  icon: <ListIcon /> },
  { v: "grid", title: "Grid view",  icon: <GridIcon /> },
] as const;

export function AccountListHeader({ view, onViewChange, onCreateClick }: {
  view: "list" | "grid";
  onViewChange: (v: "list" | "grid") => void;
  onCreateClick: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {VIEWS.map(({ v, title, icon }) => (
          <IconToggleButton key={v} active={view === v} title={title} onClick={() => onViewChange(v)}>
            {icon}
          </IconToggleButton>
        ))}
      </div>
      <PrimaryButton onClick={onCreateClick}>
        <Plus size={14} /> Create Accounts
      </PrimaryButton>
    </div>
  );
}
