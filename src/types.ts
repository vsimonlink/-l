export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  social: {
    github?: string;
    email?: string;
    twitter?: string;
    bilibili?: string;
    zhihu?: string;
  };
  nav: NavItem[];
  footer: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface PostFrontmatter {
  title: string;
  date: Date;
  updated?: Date;
  tags?: string[];
  description?: string;
  draft?: boolean;
  image?: string;
}

export interface ProjectFrontmatter {
  title: string;
  date: Date;
  tags?: string[];
  category?: string;
  image?: string;
  featured?: boolean;
  link?: string;
  repo?: string;
  description?: string;
  order?: number;
}

export interface ResumeData {
  basics: {
    name: string;
    title: string;
    summary: string;
    location: string;
    email: string;
    skills: string[];
  };
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    highlights: string[];
  }[];
  education: {
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }[];
}
