"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { SearchInput } from "@/components/ui/search_input";
import { NavDivider } from "../atoms/NavDivider";
import { clientFetch } from "../../../../service/api";
import { C } from "../tokens";

interface UserMetaProps {
  userName?: string;
}

export function UserMeta({ userName = "Admin" }: UserMetaProps) {
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await clientFetch("/users/sign_out", { method: "DELETE" });
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 14 }}>
      {!isMobile && (
        <>
          <span style={{ fontSize: 12.5, color: "#8C8C92" }}>
            Welcome, <b style={{ color: "white" }}>{userName}!</b>
          </span>
          <NavDivider />
          <SearchInput />
          <NavDivider />
          <span style={{ fontSize: 12.5, color: "#A7A7AC", cursor: "pointer" }}>Profile</span>
          <span style={{ fontSize: 12.5, color: "#A7A7AC", cursor: "pointer" }}>{userName}</span>
        </>
      )}
      <span style={{ fontSize: 12.5, color: C.accent, cursor: "pointer" }} onClick={handleLogout}>
        Logout
      </span>
    </div>
  );
}
