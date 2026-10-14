import { useState, useEffect, useCallback } from "react";

export type Language = "en" | "bn";

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      corkboard: "Pin Board",
      now: "Now",
      blog: "Blog",
      contact: "Contact",
      resume: "Resume",
      available: "AVAILABLE FOR HIRE",
    },
    hero: {
      badge: "✦ AVAILABLE FOR HIRE & COLLABORATION",
      roleHeading: "Software Engineer & Full-Stack Builder",
      tagline: "Building digital experiences with code, creativity & engineering craft.",
      intro: "CSE undergraduate at BAIUST building modern, performant and accessible web products. I turn ideas into shipped interfaces — clean code, real deployments, measurable results.",
      viewProjects: "View Projects",
      viewResume: "View Resume",
      messageMe: "Message Farhad",
      location: "Comilla, Bangladesh",
    },
    corkboard: {
      title: "Pin Board & Accolades",
      subtitle: "Hackathons, competitive coding, badges & certifications — pinned to my desk.",
      dragHint: "📌 Drag stickers anywhere · Click to inspect credentials",
      filterAll: "All Pins",
      filterComp: "Competitions",
      filterCert: "Certificates",
      filterHack: "Hackathons",
      verified: "VERIFIED",
      viewCredential: "View Credential",
      rankPrefix: "Rank / Standing",
      datePrefix: "Awarded",
      issuerPrefix: "Issuer / Org",
    },
    now: {
      title: "What I'm Doing Now",
      subtitle: "A public memo of what has my focus right now. Inspired by Derek Sivers.",
      buildingHeading: "🔨 Currently Building",
      learningHeading: "📚 Diving Deep Into",
      readingHeading: "📖 Reading & Researching",
      focusHeading: "⚡ Primary Focus",
      updatedPrefix: "Updated",
      viewPage: "View full /now page ➔",
      locationHeading: "📍 Location & Workspace",
    },
    work: {
      caseStudyBadge: "IN-DEPTH CASE STUDY",
      problemHeading: "The Problem & Challenge",
      processHeading: "Architecture & Engineering Process",
      beforeAfterHeading: "Before vs After Evolution",
      beforeLabel: "INITIAL WIREFRAME",
      afterLabel: "PRODUCTION SYSTEM",
      resultHeading: "Measurable Results & Impact",
      stackHeading: "Engineered With",
      liveDemo: "Live Production ↗",
      githubRepo: "Source Code ↗",
      backToProjects: "← Back to all projects",
    },
    easterEgg: {
      badge: "🎉 SECRET SKETCHBOOK UNLOCKED!",
      title: "You Found Farhad's Hidden Workshop!",
      subtitle: "5 rapid clicks on the logo revealed this secret doodle session.",
      quote: "\"Talk is cheap. Show me the code.\" — Linus Torvalds",
      funFact: "Fun Fact: This entire portfolio is handcrafted with TanStack Start, React 19, TypeScript & zero bloated templates.",
      close: "Awesome, back to work!",
    },
    common: {
      switchLang: "Language",
      close: "Close",
      copied: "Copied to clipboard!",
    },
  },
  bn: {
    nav: {
      home: "নীড়পাতা",
      about: "পরিচিতি",
      skills: "দক্ষতা",
      projects: "প্রজেক্টসমূহ",
      experience: "অভিজ্ঞতা",
      corkboard: "পিন বোর্ড",
      now: "বর্তমান কাজ",
      blog: "ব্লগ",
      contact: "যোগাযোগ",
      resume: "জীবনবৃত্তান্ত",
      available: "কাজের জন্য প্রস্তুত",
    },
    hero: {
      badge: "✦ নতুন প্রজেক্ট ও কাজের জন্য প্রস্তুত",
      roleHeading: "সফটওয়্যার ইঞ্জিনিয়ার ও ফুল-স্ট্যাক বিল্ডার",
      tagline: "কোডিং, সৃজনশীলতা ও নিখুঁত ইঞ্জিনিয়ারিং দিয়ে আধুনিক ডিজিটাল অভিজ্ঞতা তৈরি করি।",
      intro: "বাইউস্ট (BAIUST)-এর সিএসই শিক্ষার্থী; আধুনিক, গতিশীল ও ব্যবহারবান্ধব ওয়েব অ্যাপ্লিকেশন নির্মাণে নিবেদিত। আইডিয়াকে বাস্তবে রূপ দেওয়া ও বাস্তব ফলাফল অর্জনই আমার মূল লক্ষ্য।",
      viewProjects: "প্রজেক্টসমূহ দেখুন",
      viewResume: "রিজিউমে দেখুন",
      messageMe: "ফারহাদকে বার্তা পাঠান",
      location: "কুমিল্লা, বাংলাদেশ",
    },
    corkboard: {
      title: "পিন বোর্ড ও অর্জনসমূহ",
      subtitle: "হ্যাকাতন, কমপিটিটিভ কোডিং, মেডেল ও সার্টিফিকেশন—ওয়ার্কশপ ডেস্কে পিন করা।",
      dragHint: "📌 স্টিকারগুলো ড্র্যাগ করে নাড়াচাড়া করতে পারবেন · বিস্তারিত দেখতে ক্লিক করুন",
      filterAll: "সবগুলো",
      filterComp: "প্রতিযোগিতা",
      filterCert: "সার্টিফিকেট",
      filterHack: "হ্যাকাতন",
      verified: "ভেরিফাইড",
      viewCredential: "ক্রেডেনশিয়াল দেখুন",
      rankPrefix: "স্থান / পদমর্যাদা",
      datePrefix: "অর্জনের তারিখ",
      issuerPrefix: "প্রদানকারী প্রতিষ্ঠান",
    },
    now: {
      title: "আমি এখন যা করছি (Now)",
      subtitle: "বর্তমানে আমি কী তৈরি করছি, কী শিখছি এবং কী পড়ছি তার নিয়মিত নোট। ডেরেক সিভার্স অনুপ্রাণিত।",
      buildingHeading: "🔨 বর্তমানে যা তৈরি করছি",
      learningHeading: "📚 যা শিখছি ও চর্চা করছি",
      readingHeading: "📖 যা পড়ছি ও গবেষণা করছি",
      focusHeading: "⚡ প্রধান লক্ষ্য",
      updatedPrefix: "সর্বশেষ আপডেট",
      viewPage: "সম্পূর্ণ /now পেজ দেখুন ➔",
      locationHeading: "📍 বর্তমান অবস্থান ও ওয়ার্কস্পেস",
    },
    work: {
      caseStudyBadge: "কেস স্টাডি বিস্তারিত",
      problemHeading: "সমস্যা ও মূল চ্যালেঞ্জ",
      processHeading: "সিস্টেম আর্কিটেকচার ও কাজের ধাপ",
      beforeAfterHeading: "আগে ও পরের বাস্তব পরিবর্তন",
      beforeLabel: "প্রারম্ভিক ডিজাইন",
      afterLabel: "প্রোডাকশন সিস্টেম",
      resultHeading: "পরিমাপযোগ্য ফলাফল ও প্রভাব",
      stackHeading: "ব্যবহৃত প্রযুক্তি",
      liveDemo: "লাইভ প্রিভিউ ↗",
      githubRepo: "সোর্স কোড ↗",
      backToProjects: "← সব প্রজেক্টে ফিরে যান",
    },
    easterEgg: {
      badge: "🎉 গোপন স্কেচবুক উন্মোচিত!",
      title: "অভিনন্দন! আপনি ফারহাদের গোপন ওয়ার্কশপ খুঁজে পেয়েছেন!",
      subtitle: "লোগোতে পর পর ৫ বার ক্লিকের মাধ্যমে এই হিডেন ডুডল মোড আনলক হয়েছে।",
      quote: "\"কথা সস্তা, আমাকে কোড দেখাও।\" — লিনাস টরভাল্ডস",
      funFact: "মজার তথ্য: এই পুরো পোর্টফোলিওটি কোনো রেডিমেড টেমপ্লেট ছাড়াই TanStack Start, React 19 ও TypeScript দিয়ে তৈরি করা।",
      close: "দারুণ! আবার কাজে ফিরি",
    },
    common: {
      switchLang: "ভাষা",
      close: "বন্ধ করুন",
      copied: "ক্লিপবোর্ডে কপি হয়েছে!",
    },
  },
};

const LANG_STORAGE_KEY = "farhad_portfolio_lang";

export function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
    if (saved === "bn" || saved === "en") return saved;
  } catch {}
  return "en";
}

export function setStoredLanguage(lang: Language) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    if (lang === "bn") {
      document.documentElement.setAttribute("lang", "bn");
      document.documentElement.classList.add("lang-bn");
    } else {
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.classList.remove("lang-bn");
    }
    window.dispatchEvent(new CustomEvent("portfolio_lang_change", { detail: { lang } }));
  } catch {}
}

export function useI18n() {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const initial = getInitialLanguage();
    setLangState(initial);
    if (initial === "bn") {
      document.documentElement.setAttribute("lang", "bn");
      document.documentElement.classList.add("lang-bn");
    }

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ lang: Language }>;
      if (customEvent.detail?.lang) {
        setLangState(customEvent.detail.lang);
      }
    };

    window.addEventListener("portfolio_lang_change", handler);
    return () => window.removeEventListener("portfolio_lang_change", handler);
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    setLangState(newLang);
    setStoredLanguage(newLang);
  }, []);

  const t = translations[lang] || translations.en;

  return {
    lang,
    setLanguage: changeLanguage,
    t,
    isBn: lang === "bn",
  };
}
