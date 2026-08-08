/**
 * Thin wrapper around @vercel/analytics.
 *
 * Pageviews are tracked automatically once <Analytics /> (mounted in
 * __root.tsx) is live on a Vercel deployment — no extra code needed.
 * This file only adds a couple of custom events (resume clicks, project
 * clicks, WhatsApp clicks, contact form outcome) so you can see which
 * parts of the portfolio people actually interact with, in the
 * Analytics tab of your Vercel dashboard.
 *
 * Works out of the box on Vercel. On any other host it's a harmless no-op.
 */
import { track as vercelTrack } from "@vercel/analytics";

export function track(event: string, props?: Record<string, string | number | boolean>) {
  try {
    vercelTrack(event, props);
  } catch {
    // Analytics not available (e.g. not deployed on Vercel yet) — ignore.
  }
}
