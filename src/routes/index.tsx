import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { profile } from "@/data/portfolio";
import { Navbar } from "@/components/Navbar";
import { ScrollProgress } from "@/components/Chrome";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Education } from "@/components/Education";
import { Experience } from "@/components/Experience";
import { Credibility } from "@/components/Credibility";
import { GithubDash } from "@/components/GithubDash";
import { LiveActivity } from "@/components/LiveActivity";
import { Services } from "@/components/Services";
import { Guestbook } from "@/components/Guestbook";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { ResumeModal } from "@/components/ResumeModal";
import { MessageModal } from "@/components/MessageModal";
import { AskFarhadAI } from "@/components/AskFarhadAI";
import { AchievementPopup } from "@/components/AchievementPopup";
import { Corkboard } from "@/components/Corkboard";
import { NowSection } from "@/components/NowSection";
import { useHomeSectionsConfig } from "@/hooks/usePortfolioData";

const title = "Md. Farhadul Islam — Software Engineer & Builder";
const description =
  "Portfolio of Md. Farhadul Islam, Computer Science & Engineering student at BAIUST — Full-stack React, Next.js, and Node.js systems, competitive hackathon wins, and production engineering.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: `${profile.siteUrl}/og-image.png` },
      { property: "og:url", content: profile.siteUrl },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { property: "twitter:image", content: `${profile.siteUrl}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: profile.siteUrl }],
  }),
  component: Index,
});

function Index() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const homeSections = useHomeSectionsConfig();

  useEffect(() => {
    const handleOpenResume = () => setIsResumeOpen(true);
    const handleOpenMessage = () => setIsMessageOpen(true);

    window.addEventListener("open_resume_modal", handleOpenResume);
    window.addEventListener("open_message_modal", handleOpenMessage);

    return () => {
      window.removeEventListener("open_resume_modal", handleOpenResume);
      window.removeEventListener("open_message_modal", handleOpenMessage);
    };
  }, []);

  const sectionComponentMap: Record<string, React.ReactNode> = {
    hero: <Hero />,
    about: <About />,
    skills: <Skills />,
    projects: <Projects />,
    achievements: <Corkboard />,
    now: <NowSection />,
    education: <Education />,
    experience: <Experience />,
    credibility: <Credibility />,
    github: <GithubDash />,
    activity: <LiveActivity />,
    services: <Services />,
    guestbook: <Guestbook />,
    contact: <Contact />,
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navbar />
      <main>
        {homeSections.sections
          .filter((sec) => sec.enabled)
          .map((sec, idx) => {
            const Component = sectionComponentMap[sec.id];
            if (!Component) return null;

            const isTorn = sec.bgStyle === "bg-blueprint" || sec.bgStyle === "bg-dark-ink";
            return (
              <div
                key={`${sec.id}-${idx}`}
                className={`relative ${sec.bgStyle || "bg-paper"} ${
                  isTorn ? "torn-edge-top torn-edge-bottom" : ""
                }`}
              >
                {Component}
              </div>
            );
          })}
      </main>
      <Footer />
      <CommandPalette />
      <AchievementPopup />
      <WhatsAppFloat />
      <AskFarhadAI />
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
      <MessageModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
      />
    </div>
  );
}
