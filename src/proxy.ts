import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: Parameters<typeof handleI18nRouting>[0]) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip Next.js internals, API routes and anything with a file extension
  // (images, favicon, etc). Everything else gets locale-prefixed routing.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
