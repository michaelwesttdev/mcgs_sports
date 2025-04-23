import {
  Book,
  BookMinus,
  BookUp,
  BookUser,
  Home,
  Users,
  type LucideIcon,
  BookPlus,
  Settings,
  HelpCircle,
} from "lucide-react";
export type NavLink = {
  title: string;
  path: string;
  Icon: LucideIcon;
  subLinks?: NavLink[];
};
export const nav_links: NavLink[] = [
  {
    title: "Home",
    path: "/",
    Icon: Home,
  },
  {
    title: "Students",
    path: "/students",
    Icon: BookUser,
  },
  {
    title: "Staff",
    path: "/staff",
    Icon: Users,
  },
  {
    title: "Books",
    path: "/books/main",
    Icon: Book,
    subLinks: [
      {
        title: "Issue Book",
        path: "/books/lend",
        Icon: BookUp,
      },
      {
        title: "Bulk Lend to Staff",
        path: "/books/bulk-lend",
        Icon: BookPlus,
      },
      {
        title: "Overdue",
        path: "/books/borrowed/?filterStatus=overdue",
        Icon: BookMinus,
      },
    ],
  },
];

export const utility_links: NavLink[] = [
  {
    title: "Settings",
    path: "/settings",
    Icon: Settings,
  },
  {
    title: "Help",
    path: "/help",
    Icon: HelpCircle,
  },
];
