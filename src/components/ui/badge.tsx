import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

export function Badge({ className = "", children, ...props }: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  return (
    <span className={[base, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </span>
  );
}
