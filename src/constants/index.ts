import {
  AlertCircle,
  CheckSquare,
  CircleDollarSign,
  FileEdit,
  FileText,
  Gauge,
  Home,
  House,
  Info,
  NotepadText,
  Tag,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PRICING: "/pricing",
  LOGIN: "/auth/login",
  SIGNUP: "/auth/sign-up",
  SERVICE_DETAILS: "/service-details/:id",
};

export const LANDING_PAGE_NAV_LINKS = [
  {
    name: "home",
    href: PUBLIC_ROUTES.HOME,
    icon: House,
  },
  {
    name: "about",
    href: PUBLIC_ROUTES.ABOUT,
    icon: Info,
  },
  {
    name: "pricing",
    href: PUBLIC_ROUTES.PRICING,
    icon: CircleDollarSign,
  },
];

export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  MY_REQUESTS: "/dashboard/my-requests",
  NEED_ACTIONS: "/dashboard/need-actions",
  DRAFTS: "/dashboard/drafts",
  CLOSED: "/dashboard/closed",
};

interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarLinkGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  needAuth: boolean;
  links: SidebarLink[];
}

export const SIDEBAR_LINKS: SidebarLinkGroup[] = [
  {
    id: "services",
    title: "services",
    icon: Tag,
    needAuth: false,
    links: [{ title: "services", href: "/", icon: Tag }],
  },

  {
    id: "dashboard",
    title: "dashboard",
    icon: Gauge,
    needAuth: true,
    links: [{ title: "home", href: "/dashboard", icon: Home }],
  },
  {
    id: "requests",
    title: "requests",
    icon: NotepadText,
    needAuth: true,
    links: [
      { title: "myRequests", href: "/dashboard/my-requests", icon: FileText },
      { title: "drafts", href: "/dashboard/drafts", icon: FileEdit },
      {
        title: "needActions",
        href: "/dashboard/need-actions",
        icon: AlertCircle,
      },
      { title: "closed", href: "/dashboard/closed", icon: CheckSquare },
    ],
  },
];
