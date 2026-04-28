import { C } from "./tokens";
import { LogoMark }          from "./atoms/LogoMark";
import { NavTabBar }          from "./molecules/NavTabBar";
import { MobileMenuButton }   from "./molecules/MobileMenuButton";
import { UserMeta }           from "./molecules/UserMeta";

interface TopNavProps {
  userName?: string;
}

export function TopNav({ userName }: TopNavProps) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.ink, color: "white",
      borderBottom: `1px solid ${C.line2}`,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", height: 48, borderBottom: `1px solid ${C.line2}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <MobileMenuButton />
          <LogoMark />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: "white" }}>
            RepTrack
          </span>
        </div>
        <UserMeta userName={userName} />
      </div>
      <NavTabBar />
    </div>
  );
}
