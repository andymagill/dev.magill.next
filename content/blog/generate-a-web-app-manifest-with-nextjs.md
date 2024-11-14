---
title: Generate a web app manifest with Next.js
description: Let's explore how to automate the generation of a web app manifest in a Next.js project, and how this simple JSON file can help enhance your web app's appearance and branding.
image: /images/blog/app-icon-mage.jpg
tags: metadata, nextjs, webdev
created: 1731610486
lastUpdated:
---

The web app manifest is a simple way to reinforce the branding of your web application. In it's most basic form, it’s a just JSON file that provides relevant metadata about your website, allowing browsers to present your app like a native application. This includes details like the app's name, icons, theme colors, and display preferences. In this article, we’ll walk through how to create and implement a generated web app manifest in your Next.js application. So buckle up, because we're about to make your site look like it means business—without actually having to wear a suit.

## What the Heck is a Manifest?

Think of a web app manifest as your application's dating profile. It's where you showcase all your best features: your name (looking sharp!), your icons (hello, good looks), and how you want to be displayed (modest or full-screen drama?). This little JSON file tells browsers, "Hey, I'm not just another webpage. I have some personality."

## Using Generated Manifests in Next.js

Next.js provides a convenient way to generate a web app manifest dynamically using its metadata API. This approach allows you to customize your manifest based on your application's configuration or environment.
This allows browsers to present the web app similarly to native applications, enabling features like installation on the home screen and full-screen display.

### Implementation

Ready to get your hands dirty? Let’s dive into creating a [generated web app manifest](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest#generate-a-manifest-file) in your Next.js project:

1. **Generate the Manifest File**:
   First things first, create a new file named `manifest.ts` or `manifest.js` in your `app` directory. Next.js treats `manifest.js` as a special Route Handler that is cached by default. This is where the magic happens.

   Here’s an example of what that code might look like:

   ```typescript
   import { MetadataRoute } from 'next';

   export default function manifest(): MetadataRoute.Manifest {
     return {
       name: 'My Next.js Application',
       short_name: 'Next.js App',
       description: 'A super-duper application built with Next.js',
       start_url: '/',
       display: 'standalone',
       background_color: '#ffffff',
       theme_color: '#000000',
       icons: [
         {
           src: '/favicon.ico',
           sizes: 'any',
           type: 'image/x-icon',
         },
         {
           src: '/icon-512x512.png',
           sizes: '512x512',
           type: 'image/png',
         },
       ],
     };
   }
   ```

   You can see my [latest implementation](https://github.com/andymagill/dev.magill.next/blob/master/app/manifest.ts) of this on github.

2. **Add Icon Files**:
   Now, let’s get fancy! Place the icon files directly in the `app` directory. Next.js will [automagically detect these files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png) and generate the necessary `<link>` elements in the `<head>` of your application. You can use various file types including `.ico`, `.jpg`, `.jpeg`, `.png`, and `.svg`. Just make sure they’re high quality—nobody likes an ugly icon!

   If you need to create something quick and easy, I recommend the [generator on favicon.io](https://favicon.io/favicon-generator/). If you want something super fancy, you can have a Next.js actually [generate the icon images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) for you.

3. **Automatic Linking**:
   Here’s where it gets even better—Next.js will automagically detect your `manifest.ts` or `manifest.js` file and add the appropriate `<link>` tag to your HTML's `<head>`. It’s like magic, but without the rabbits and top hats.

4. **Test Your Implementation**:
   Finally, build and run your Next.js application. If you've done your job well, this will be very boring. Use browser developer tools to verify that the manifest and icons are being served correctly. If everything looks good, congratulations! You’ve just leveled up your web app.

## Conclusion

I started this task simply becuase I wanted to add a favicon to [my professional website](https://magill.dev), and ended up in a rabbit hole of web manifests and PWA's. By utilizing a generated web app manifest in my Next.js site, I can reinforce my visual branding and provide a more similar experience to native apps. This approach allows me to customize my manifest easily while ensuring that all necessary details are readily available for users who want it.

By leveraging Next.js's built-in support for web manifests, we can create a more engaging and accessible web application. Next.js's automatic handling of manifest and icon metadata simplifies the whole process, reducing the potential for errors and making it easier to implement more interesting PWA features in a Next.js project.

### Related Links

[Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) from MDN
[Generate a Manifest file](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest#generate-a-manifest-file) from Next.js
[App Icon Metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) from Next.js