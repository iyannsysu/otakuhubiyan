import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "outline" | "secondary";
}) {
  const variants = {
    default:
      "bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/20",
    outline:
      "bg-transparent text-[var(--foreground)] border-[var(--border)]",
    secondary:
      "bg-[var(--secondary)] text-[var(--secondary-foreground)] border-transparent",
  } as const;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium leading-tight",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
