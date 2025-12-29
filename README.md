# dev.magill.next

# Intro

This project is a TypeScript/React/Next.JS portfolio and statically generated blogging application for my professional website at https://magill.dev. Built following the JAMstack architectural approach, it features analytics, unit testing, static site generation, dynamic routing, social sharing, automated sitemaps, RSS feed, markdown content parsing, and more.

## Installation

To install, follow these steps:

1. Make sure you have Node.js version 14 or higher installed on your machine.
2. Install pnpm if you haven't already: `npm install -g pnpm` (or see [pnpm installation guide](https://pnpm.io/installation))
3. Clone the repository: `git clone https://github.com/andymagill/dev.magill.next.git`
4. Install the project dependencies: `pnpm install`

## Development

`pnpm run dev`: Start the development server.

## Building

`pnpm run build`: Create a production build of the application

`pnpm run start`: Start the application using SSR in production mode

`pnpm run serve`: Serve the static version using SSG in production mode

## Testing

`pnpm run test`: Run the tests using Vitest.

`pnpm run analyze`: Run the Next.JS Build Analyzer.

## Code Formatting and Linting

`pnpm run format`: Check the code for formatting and linting errors.

`pnpm run fix`: Correct the code according to the project's configuration.

## Project Structure

- `app`: Contains the React App.
- `app/components`: Contains all React components.
- `app/pages`: Contains all Next.js pages.
- `utils`: Contains utility functions.
- `public`: Contains static file assets.
- `content`: Contains site content.

## Technologies Used

- **JAMstack:** The project follows JAMstack principles, delivering fast, secure, and scalable sites using JavaScript, APIs, and pre-rendered Markup.
- **Next.js:** A popular React-based framework for building server-side rendered (SSR) and statically generated websites and applications.
- **TypeScript:** A superset of JavaScript that adds optional static typing and other features to improve the development experience.
- **ESLint:** A static code analysis tool used to flag suspicious code and enforce coding standards.
- **Prettier:** A code formatter that automatically formats code to a consistent style.
- **Vitest:** A fast unit testing framework for JavaScript applications.
- **CSS Modules:** A CSS file in which all class names and animation names are scoped locally by default.
- **SASS:** A CSS preprocessor that adds power and elegance to the basic language, used for more maintainable stylesheets.
- **Markdown:** Used for blog content and documentation, with [gray-matter](https://www.npmjs.com/package/gray-matter) for frontmatter parsing and [markdown-to-jsx](https://www.npmjs.com/package/markdown-to-jsx) for rendering Markdown as React components.
- **RSS Feed:** The [`rss`](https://www.npmjs.com/package/rss) library is used to generate an RSS feed for blog posts, improving discoverability and syndication.
- **next-sitemap:** Automatically generates a sitemap for SEO optimization.
- **@fortawesome/react-fontawesome:** Provides scalable vector icons for UI.
- **@next/bundle-analyzer:** A tool for visualizing the size of output files with an interactive zoomable treemap.  
  _Run `pnpm run analyze` to generate a bundle report after building._
- **Jest DOM & Testing Library:** For improved assertions and React component testing.
- **Serve:** Used to serve the static build output locally.
- **Wrangler:** For managing Cloudflare Workers (if used for deployment or edge functions).

## External Documentation and Resources

- [JAMstack Official Website](https://jamstack.org/) — Learn more about the JAMstack architecture, best practices, and community resources.
- [Next.js Documentation](https://nextjs.org/docs) — Official documentation for the Next.js framework.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) — Comprehensive TypeScript documentation and guides.
- [React Documentation](https://react.dev/) — Official React documentation, including tutorials and API reference.
- [Vitest Documentation](https://vitest.dev/) — Documentation for the Vitest testing framework.
- [gray-matter](https://www.npmjs.com/package/gray-matter) — Library for parsing frontmatter from markdown files.
- [markdown-to-jsx](https://www.npmjs.com/package/markdown-to-jsx) — Render Markdown directly in JSX components.
- [RSS npm package](https://www.npmjs.com/package/rss) — Library for generating RSS feeds.
- [next-sitemap](https://www.npmjs.com/package/next-sitemap) — Tool for generating sitemaps with Next.js.
- [Font Awesome React](https://fontawesome.com/v5/docs/web/use-with/react/) — Documentation for using Font Awesome icons with React.
- [Serve](https://www.npmjs.com/package/serve) — Static file serving and directory listing.
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — CLI for Cloudflare Workers.

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Create a [pull request on GitHub](https://github.com/andymagill/dev.magill.next/pulls).


## Dependency maintenance

Dependabot checks run weekly on Monday mornings, and the configuration at [.github/dependabot.yml](.github/dependabot.yml#L1-L57) keeps updates predictable by grouping Next.js/runtime packages, markdown/content tooling, general dev utilities, and GitHub Actions workflows into a maximum of three pnpm PRs and two workflow PRs per cycle. Treat each incoming PR as part of its named group so we can merge a complete bundle of related changes instead of reacting to scattered updates.


### Creating Issues

If you encounter a bug, have a feature request, or want to make a suggestion, please open an issue using the [GitHub Issues](https://github.com/andymagill/dev.magill.next/issues) page.

**When creating an issue:**

- Provide a clear and descriptive title.
- Include steps to reproduce the problem if reporting a bug.
- Attach screenshots or error logs if helpful.
- Suggest possible solutions or describe your expected outcome if applicable.
- For feature requests, explain the use case and benefits.

Your feedback helps improve the project!
