import { ChevronDown } from "./ChevronDown";

export function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {children}
      <ChevronDown />
    </div>
  );
}
