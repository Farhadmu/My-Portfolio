import { useState, useEffect, useCallback } from "react";
import {
  getBlogs,
  getProjects,
  getSkillGroups,
  getExperiences,
  getEducations,
  getServices,
  getTestimonials,
  getCertificates,
  getProfileConfig,
  type BlogPost,
  type DynamicProject,
  type DynamicTestimonial,
  type DynamicCertificate,
  type UserProfileConfig,
  DEFAULT_PROFILE_CONFIG,
} from "@/lib/supabase";
import {
  projects as defaultProjects,
  skillGroups as defaultSkillGroups,
  experience as defaultExperience,
  education as defaultEducation,
  services as defaultServices,
  testimonials as defaultTestimonials,
  certificates as defaultCertificates,
} from "@/data/portfolio";

export function useDynamicBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getBlogs().then((data) => {
      setBlogs(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { blogs, loading, reload };
}

export function useDynamicProjects() {
  const [projects, setProjects] = useState<DynamicProject[]>(defaultProjects);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { projects, loading, reload };
}

export function useDynamicSkills() {
  const [skillGroups, setSkillGroups] = useState<typeof defaultSkillGroups>(defaultSkillGroups);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getSkillGroups().then((data) => {
      setSkillGroups(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { skillGroups, loading, reload };
}

export function useDynamicExperience() {
  const [experience, setExperience] = useState<typeof defaultExperience>(defaultExperience);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getExperiences().then((data) => {
      setExperience(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { experience, loading, reload };
}

export function useDynamicEducation() {
  const [education, setEducation] = useState<typeof defaultEducation>(defaultEducation);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getEducations().then((data) => {
      setEducation(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { education, loading, reload };
}

export function useDynamicServices() {
  const [services, setServices] = useState<typeof defaultServices>(defaultServices);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { services, loading, reload };
}

export function useDynamicTestimonials() {
  const [testimonials, setTestimonials] = useState<DynamicTestimonial[]>(
    defaultTestimonials.map((t, idx) => ({
      id: `testi-${idx + 1}`,
      name: t.name,
      role: t.role,
      quote: t.quote,
      rating: 5,
    }))
  );
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getTestimonials().then((data) => {
      setTestimonials(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { testimonials, loading, reload };
}

export function useDynamicCertificates() {
  const [certificates, setCertificates] = useState<DynamicCertificate[]>(
    defaultCertificates.map((c, idx) => ({
      id: `cert-${idx + 1}`,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      icon: c.icon,
    }))
  );
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    getCertificates().then((data) => {
      setCertificates(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    reload();
    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    return () => window.removeEventListener("portfolio_data_changed", handleUpdate);
  }, [reload]);

  return { certificates, loading, reload };
}

export function useProfileConfig(): UserProfileConfig {
  const [config, setConfig] = useState<UserProfileConfig>(DEFAULT_PROFILE_CONFIG);

  const reload = useCallback(() => {
    setConfig(getProfileConfig());
  }, []);

  useEffect(() => {
    // Immediate client reload to hydrate from localStorage
    reload();

    const handleUpdate = () => reload();
    window.addEventListener("portfolio_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("portfolio_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [reload]);

  return config;
}
