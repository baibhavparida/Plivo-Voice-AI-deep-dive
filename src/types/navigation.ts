export interface NavigationItem {
  title: string;
  href?: string;
  icon?: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
  children?: TableOfContentsItem[];
}

export interface PrevNextItem {
  title: string;
  href: string;
  category?: string;
}
