import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware wrappers around next/link, next/navigation etc.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
