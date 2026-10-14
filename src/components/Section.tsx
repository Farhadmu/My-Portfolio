import React from "react";

export function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "left",
  underlineColor = "blue",
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
  underlineColor?: "blue" | "red";
}) {
  const isCenter = align === "center";

  return (
    <div className={`mb-10 max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow && (
        <div className={`mb-2 flex items-center gap-2 ${isCenter ? "justify-center" : ""}`}>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 rounded border-2 border-slate-900 dark:border-slate-500 shadow-[1px_1px_0px_#0f172a] dark:shadow-[1px_1px_0px_#000]">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
        <span className="relative inline-block">
          {title}
          <svg
            className="absolute -bottom-2 left-0 w-full overflow-visible pointer-events-none"
            height="12"
            viewBox="0 0 200 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M2 8C55 3 145 2 198 7C160 11 80 11 30 10"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              className={underlineColor === "red" ? "text-accent stroke-draw" : "text-primary stroke-draw"}
            />
          </svg>
        </span>
      </h2>
      {desc && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base font-normal max-w-[68ch]">
          {desc}
        </p>
      )}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
  bgStyle = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  bgStyle?: string;
}) {
  const isTornEdge = bgStyle === "bg-blueprint" || bgStyle === "bg-dark-ink";

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 px-5 py-20 sm:py-24 ${bgStyle} ${
        isTornEdge ? "torn-edge-top torn-edge-bottom" : ""
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
