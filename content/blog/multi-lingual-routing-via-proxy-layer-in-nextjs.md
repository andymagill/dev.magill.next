---
title: Multi-lingual Routing via Proxy Layer in Next.js 16
description: Learn how to structure a Next.js 16 proxy layer to orchestrate multi-lingual routing, API authentication, and SEO-friendly URLs with different route classifications.
image: /images/blog/routing-diagram.png
tags: internationalization, middleware, multilingual routing, i18n, Next.js
created: 1768327304
lastUpdated: 1770397785
---

One of [my recent projects](https://markdownmixer.com) had an interesting mix of requirements: API-driven user authentication, SEO-friendly URLs, and multi-lingual translation. I used the Proxy Layer pattern in Next.js 16 as a central orchestrator for all app traffic to handle these overlapping concerns cleanly.

## **Three-way Route Classification**

Applying i18n logic globally can create duplicate URLs and performance delays. Instead, I classified every request into three distinct areas:

### **SEO-First Routes (The Translated Tier)**

For the homepage, /about, and /blog, the **URL is the absolute source of truth**. next-intl enforces locale URL prefixing (e.g., /fr/blog). Even if a user has a cookie suggesting one language, if they land on a French URL, the proxy respects it to ensure link integrity and [SEO consistency](https://magill.dev/post/ai-discoverability-structured-data-gives-rich-context-to-clueless-crawlers).

### **Application Routes (The Clean-URL Tier)**

For authenticated routes like /editor, /library, and /settings, the **source of truth is the cookie/session**. These URLs remain "clean" without locale prefixes. The proxy detects locale from headers or cookies, allowing the UI to localize without URL changes.

### **System Routes (The Auth Bypass)**

The auth callback route is sensitive—the browser must parse URL hash tokens without server-side interference to establish the session. A redirect could strip the authentication token.

I used Next.js middleware matcher configuration to exclude system routes entirely, eliminating unnecessary middleware execution for static assets, API routes, and auth callbacks:

```typescript
// proxy.ts
export const config = {
  matcher: ['/((?!api|_next|_vercel|auth/callback|images|icons|.*\\..*).*)'],
};
```
## **Locale Selection: Headers vs. Cookies**

The strategy for determining which locale to display differs by route type:

### **The Homepage Exception**

For users landing on the root `/`, the proxy detects locale from the browser's `Accept-Language` header—not cookies. This prevents "sticky" language redirects from a previous visit:

```typescript
// proxy.ts - Root homepage handler
async function handleRootHomepage(request: NextRequest, startTime: number) {
  const response = NextResponse.next();
  
  // Ignore cookies; use browser language detection only
  const preferredLocale = getBrowserOnlyLocale(request);
  response.headers.set('x-locale', preferredLocale);
  
  return handleAuth(request, response, {
    startTime,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

export function getBrowserOnlyLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  
  if (acceptLanguage) {
    const browserLanguages = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].split('-')[0].trim())
      .filter((lang) => locales.includes(lang as Locale));
    
    return browserLanguages[0] || 'en';
  }
  
  return 'en';
}
```

## **Centralized Route Pattern Management**

Centralize all route patterns in one configuration object to make logic declarative and eliminate magic strings:

```typescript
// app/lib/proxy/route-utils.ts
export const ROUTE_PATTERNS = {
  ROOT: '/',
  LOCALIZED: /^\/[a-z]{2}(\/.*)?$/,
  ABOUT: /^\/about(\/.*)?$/,
  BLOG: /^\/blog(\/.*)?$/,
  EDITOR: /^\/editor/,
  LIBRARY: /^\/library/,
  SETTINGS: /^\/settings/,
};

export const ROUTE_CATEGORIES = {
  INTERNATIONALIZED: [
    ROUTE_PATTERNS.ROOT,
    ROUTE_PATTERNS.LOCALIZED,
    ROUTE_PATTERNS.ABOUT,
    ROUTE_PATTERNS.BLOG,
  ],
  AUTH_TRACKED: [
    ROUTE_PATTERNS.EDITOR,
    ROUTE_PATTERNS.LIBRARY,
    ROUTE_PATTERNS.SETTINGS,
  ],
};
```

## **Isolated Handler Modules**

The proxy delegates to specialized handlers rather than implementing everything inline. Each concern lives in its own module:

```typescript
// proxy.ts - Orchestration only
import { handleI18n, applyI18nMiddleware } from './app/lib/proxy/i18n';
import { handleAuth } from './app/lib/proxy/auth';
import { getPreferredLocale, getBrowserOnlyLocale } from './app/lib/proxy/locale';

export async function proxy(request: NextRequest) {
  const route = classifyRoute(pathname);
  
  if (route.isRoot) {
    return handleRootHomepage(request);
  } else if (route.shouldUseI18n) {
    return handleInternationalizedRoute(request);
  } else {
    return handleNonInternationalizedRoute(request);
  }
}
```

### **Tiered Preference Cascade**

For non-root routes, use a four-tier fallback system:

1. **Explicit Cookie** – User-selected via UI
2. **User Profile** – Auth-linked preference
3. **Browser Header** – Accept-Language
4. **Default** – English

```typescript
// app/lib/proxy/locale.ts
export function getPreferredLocale(request: NextRequest): Locale {
  // 1. Explicit locale cookie (user-selected via UI)
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // 2. User profile preference (authenticated users)
  const userPreference = request.cookies.get('USER_LANGUAGE_PREFERENCE')?.value;
  if (userPreference && userPreference !== 'auto' && locales.includes(userPreference)) {
    return userPreference;
  }
  
  // 3. Browser Accept-Language header
  const browserLocale = getBrowserOnlyLocale(request);
  if (browserLocale !== 'en') {
    return browserLocale;
  }
  
  // 4. Default fallback
  return 'en';
}
```

The cookie is only updated when the detected preference differs from the current value, minimizing header writes:

```typescript
// app/lib/proxy/i18n.ts
export function setLocaleCookieForResponse(
  request: NextRequest,
  response: NextResponse,
): NextResponse {
  const preferredLocale = getPreferredLocale(request);
  const currentCookie = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Only set if changed (performance optimization)
  if (currentCookie !== preferredLocale) {
    response.cookies.set('NEXT_LOCALE', preferredLocale, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  
  return response;
}
```

## **Route Classification Logic**

The proxy classifies routes before processing them to determine which handling pattern to apply:

```typescript
// app/lib/proxy/route-utils.ts
export function classifyRoute(pathname: string): RouteClassification {
  const isRoot = pathname === '/';
  const isLocalized = /^\/[a-z]{2}(\/.*)?$/.test(pathname);
  
  const shouldUseI18n = 
    isRoot || 
    isLocalized || 
    /^\/about(\/.*)?$/.test(pathname) ||
    /^\/blog(\/.*)?$/.test(pathname);
  
  const shouldCheckAuth = matchesAnyPattern(pathname, ROUTE_CATEGORIES.AUTH_TRACKED);
  
  return { isRoot, isLocalized, shouldUseI18n, shouldCheckAuth };
}
```

This classification ensures that the proxy acts as a high-speed filter, directing each request to the appropriate handler without unnecessary processing.

## **Conclusion**

By classifying routes before processing, the proxy becomes a high-speed filter rather than a bottleneck. Each request reaches the appropriate handler with minimal overhead, ensuring auth-tokens remain intact, crawlers get the right content, and users see their preferred language without broken URLs. 

## Related Links

- [Next.js Routing and Dynamic Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing): Official Next.js documentation on routing strategies and dynamic route handling.
- [next-intl Library](https://next-intl-docs.vercel.app/): Comprehensive guide to implementing internationalization (i18n) in Next.js applications.
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth): Learn about API-driven authentication flows and managing auth callbacks in your application.
