---
title: Multi-lingual Routing via Proxy Layer in Next.js 16
description: Learn how to structure a Next.js 16 proxy layer to orchestrate multi-lingual routing, API authentication, and SEO-friendly URLs with different route classifications.
image: images/blog/routing-diagram.png
tags: internationalization, middleware, multilingual routing, i18n, Next.js
created: 1768327304
lastUpdated:
---

One of [my recent projects](https://markdownmixer.com) had an interesting mix of requirements: API-driven user authentication, SEO-friendly URLs, and multi-lingual translation. These things might seem unrelated, but they converge to create some unique request handling requirements. To address these demands holistically, I used the new Proxy Layer pattern in Next.js 16 as a central orchestrator for all app traffic. This was called middleware back in 2024. Here is how I structured this to properly handle complex routing boundaries.

## **Three-way Route Classification**

I found out the hard way that applying i18n logic globally can create duplicate URLs and delays in the server response.  To avoid these sticky issues, I classified every request into three distinct areas:

### **SEO-First Routes (The Translated Tier)**

For the homepage, /about, and /blog, I prioritized search engine visibility. next-intl helps enforce locale URL prefixing (e.g., /fr/blog). Here we treated the **URL as the absolute source of truth**. Even if a user has a cookie suggesting one language, if they land on a French URL, the proxy respects the URL to ensure link integrity and [SEO consistency](/post/ai-discoverability-structured-data-gives-rich-context-to-clueless-crawlers).

### **Application Routes (The Clean-URL Tier)**

For the interactive parts of the app—the /editor, /library, and /settings—I deliberately bypassed the next-intl prefixing. URLs should remain "clean" and predictable for authenticated users. Here we shifted the **source of truth to the cookie/session**. The proxy detects the locale via headers or cookies and hydrates the internal state, allowing the UI to localize without changing the URL structure.

### **System Routes (The Bypass Tier)**

Here we need a strict exclusion list for API routes, static assets, and magical Next.js paths. Requests for favicon.ico, sitemap.xml, or _next/static do not need to know about the user's language or auth status. Bypassing these routes significantly reduced middleware execution time and prevented logging noise.

#### The Auth Bypass

My project used Supabase Auth, so I needed to bypass any special routing logic to keep this integration running smoothly. The auth callback route is a highly-sensitive area that requires a deterministic flow. The browser needs to parse the URL hash tokens without server-side interference to establish the initial session. I wanted to ensure that the auth handshake never triggered a redirect, which could strip away the authentication token from the URL. Understanding [how to properly handle user authentication and data access patterns](/post/row-level-security-in-serverless-postgresql-for-hipaa-compliance) is critical at this layer.

```typescript
if (pathname.startsWith('/auth/callback')) {
  logMiddleware('info', 'Auth callback route - bypassing middleware', {
    operation: 'bypass-auth-callback',
    reason: 'Allow client-side hash parsing',
  });
  return NextResponse.next();
}
```

## **Locale selection: Headers vs. Cookies**

When drilling down into the logic of language selection, we encounter a common UX conflict: how long should a user’s language preference persist? I chose a hybrid approach based on the entry point.

### **The "Homepage Exception"**

For users landing on the root /, we should **not** display locale based on cookies. Instead, we should read the Accept-Language header for that specific request. This prevents "sticky" language redirects that might frustrate a user who accidentally visited a localized version of the site previously.

### **Tiered Preference Persistence**

For all other routes without a local URL prefix, we can use a fall-through system to determine which locale to display:

1. **Explicit Cookie:** User-selected preference.  
2. **User Profile:** Auth-linked preference.  
3. **Browser Header:** Standard OS language.

I only update the `NEXT_LOCALE` cookie if the detected preference differs from the current one, minimizing slow header writes.

## **Conclusion**

Moving this orchestration into a structured `proxy.ts` solved the inherent friction between dynamic application state and static SEO requirements. By classifying routes before processing them, the proxy no longer acts as a bottleneck, but as a high-speed filter that ensures auth-tokens remain intact, crawlers find the right content, and users see their preferred language without broken URLs. This approach builds on [fundamental Next.js architecture principles](/post/lets-breakdown-my-website) while adding sophisticated routing logic for complex applications.

## Related Links

- [Next.js Routing and Dynamic Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing): Official Next.js documentation on routing strategies and dynamic route handling.
- [next-intl Library](https://next-intl-docs.vercel.app/): Comprehensive guide to implementing internationalization (i18n) in Next.js applications.
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth): Learn about API-driven authentication flows and managing auth callbacks in your application.