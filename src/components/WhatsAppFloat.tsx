import { profile } from "@/data/portfolio";
import { WhatsappIcon } from "./BrandIcons";
import { track } from "./analytics";

export function WhatsAppFloat() {
  return (
    <a
      href={profile.whatsapp}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("whatsapp_click", { source: "float_button" })}
      aria-label={`Message ${profile.shortName} on WhatsApp`}
      className="group fixed bottom-4 left-4 z-40 grid size-12 place-items-center rounded-full shadow-[0_8px_28px_-6px_rgba(37,211,102,0.55)] transition-transform hover:scale-110 sm:bottom-5 sm:left-5 sm:size-14"
      style={{ background: "#25D366" }}
    >
      {/* soft pulsing ring to draw the eye without being loud */}
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#25D366] opacity-40" />
      <WhatsappIcon className="relative size-5 text-white sm:size-6" />

      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-border bg-popover px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        Message me on WhatsApp
      </span>
    </a>
  );
}
