---
title: Generate a Web App Manifest with Next.js
description: Let's explore how to automate the generation of a web app manifest in a Next.js project, and how this simple JSON file can help enhance your web app's appearance and branding.
image: /images/blog/app-icon-mage.jpg
tags: Metadata, NextJS, PWA
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

   The example code above uses placeholder content, but you can easily add logic to pull in details from elsewhere in your application. You can see my [latest implementation](https://github.com/andymagill/dev.magill.next/blob/master/app/manifest.ts) of this on github, where I use a `settings` object that was already available for other functionality.

   But wait, it gets even better—Next.js will _automagically_ detect your `manifest.ts` or `manifest.js` file and add the appropriate `<link>` tag to your HTML's `<head>`. It’s like magic, but without the rabbits and top hats.

2. **Add Icon Files**:
   Now, let’s place the icon files directly in the `app` directory. Next.js will [detect these files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png) and generate the necessary `<link>` elements in the `<head>` of your application. You can use various file types including `.ico`, `.jpg`, `.jpeg`, `.png`, and `.svg`. Just make sure they’re high quality—nobody likes an ugly icon!

   If you need to create something quick and easy, I recommend the [generator on favicon.io](https://favicon.io/favicon-generator/) to create the actual icon files. If you want something super fancy, you can have a Next.js actually [generate the icon images](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) for you. Pretty cool, but out-of-scope for my purposes.

3. **Test Your Changes**:
   Finally, build and run your Next.js application. If you've done your job well, this will be very boring. Take a peek in the developer tools to verify that the manifest and icons are being served correctly. If everything looks good, congratulations! You’ve just leveled up your web app.

## The Closing Tag

I started this task simply because I wanted to update the favicon on [my professional website](https://magill.dev), and I somehow ended up in a rabbit hole of web manifests and PWA functionality. It's all part of the process of [crafting a developer website for professional growth](/post/crafting-a-developer-website-for-professional-growth). By using a generated web app manifest in my Next.js site, I can reinforce my visual branding and provide a more similar experience to native apps. Next.js's built-in support for web manifests allows me to customize the manifest easily while creating a more engaging and accessible web application. Next.js's automatic handling of manifest and icon metadata simplifies the whole process, reducing the potential for human errors and laying the ground-work for more interesting PWA features (to be continued).

### Related Links

- [Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) from MDN
- [Generate a Manifest file](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest#generate-a-manifest-file) from Next.js
- [App Icon Metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) from Next.js
