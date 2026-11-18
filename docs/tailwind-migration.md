# Styling with Tailwind CSS

This site moved from SCSS Modules to Tailwind CSS v4 (with Preflight). This page records where styles live, the conventions to follow, and the checklist used for the migration, so new components follow the same rules.

## Where styles live

| File                                                           | Layer        | Contents                                                                                                         |
| -------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| `app/globals.css`                                              | —            | Tailwind entry: imports, `@theme` tokens, `dark` custom variant, `glass` utility                                 |
| `app/styles/base.css`                                          | `base`       | CSS variables (`--gap`, `--foreground`, …), element defaults, heading restore after Preflight, `body.modal-open` |
| `app/styles/highlight.css`                                     | `base`       | highlight.js syntax colors (third-party markup)                                                                  |
| `app/styles/markdown.css`                                      | `components` | `.markdown` (post body) and `.markdown-compact` (project modal) for generated HTML                               |
| `app/styles/components.css`                                    | `components` | `.btn`, `.btn-outline`                                                                                           |
| `HeroAnimation.module.scss`, `BackgroundAnimation.module.scss` | unlayered    | Self-contained animations (`@property`, multi-stop keyframes)                                                    |

Everything else is utility classes in the components.

### Tokens

| Token                                                                                         | Use                                                    |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `background`, `background-too`, `foreground`, `line`, `always-white`, `always-black` (colors) | `bg-background`, `text-foreground`, `border-line`, …   |
| `gap`, `gutter` (spacing)                                                                     | `p-gap`, `gap-gap`, `mt-gutter`, …                     |
| `inner`, `blog` (containers)                                                                  | `max-w-inner`, `max-w-blog`                            |
| `xs` breakpoint (480px)                                                                       | `xs:` / `max-xs:` (with Tailwind's `sm` 640, `md` 768) |
| `animate-pulse-soft`                                                                          | ListenButton processing state                          |

The theme tokens point at the CSS variables in `base.css` (`@theme inline`), so dark mode still works by switching the variables. `dark:` uses the site's full dark-mode media query.

## What stays outside utilities

- **Complex animations** (`@property`, multi-stop keyframes) stay in their SCSS module.
- **Global element defaults and tokens** go in `styles/base.css`.
- **Third-party markup** (highlight.js) goes in `styles/highlight.css`.
- **Generated HTML** (markdown, sanitized HTML) uses `.markdown` / `.markdown-compact`.
- **Reused multi-state patterns** (buttons) go in `styles/components.css`.
- **Simple keyframes** become an `--animate-*` token in `@theme`.

## Conventions

1. **Mind the cascade.** Tailwind output is in `@layer`s. Unlayered CSS, such as any SCSS module, beats every utility whatever its specificity. Remaining modules must only style their own elements.
2. **Parents don't restyle children.** Give the child a typed `variant` prop instead, e.g. `ProjectCard variant='archive'`, `PostList variant='compact'`, `Hero layout='row'`.
3. **`className` props are for additive classes only**, never for overriding a child's own utilities (e.g. Header passing the mobile collapse to `Navigation`).
4. **Children you don't own:** a few arbitrary descendant variants are fine (`[&_h1]:mb-4`). If you need more than that, it's prose.
5. **Ancestor or sibling state:** use `group-*` / `peer-*`, named groups (`group/item`) when nested. Stagger with an inline CSS variable (`--index`, `--reveal-delay`) instead of `nth-child`.
6. **Match existing values exactly:** use arbitrary values (`text-[0.88rem]`) rather than the nearest scale step. Named `text-*` sizes also set line-height. Always give a duration and easing with `transition-*`. In v4, `translate-*`, `rotate-*` and `scale-*` set the individual `translate` / `rotate` / `scale` properties, so an arbitrary transition list must name those (`transition-[translate,box-shadow]`), not `transform`. If an arbitrary value repeats 3 or more times, promote it to a `@theme` token.
7. **Filters compose in a fixed order** (`brightness` before `contrast`). When the order matters, use an arbitrary property: `[filter:contrast(0%)_brightness(2)]`.
8. **Conditional classes use `clsx`.** Variants are written so they never conflict, so `tailwind-merge` isn't needed.
9. **Tests** assert roles, text or hook classes (`header`, `navigation`), never generated or utility class names.

## Checklist for converting a component

1. Read the stylesheet. Grep each class name in TSX and drop rules that nothing uses. List every `:global(...)` that targets this component from elsewhere.
2. Sort each rule using "What stays outside utilities" above.
3. Put utilities on the elements that own them. Turn parent overrides into a `variant` prop, and state into `clsx`.
4. Delete the module file and its import. Remove the parent's `:global` block in the same commit.
5. Update tests to drop `styles.*` and module mocks. Add a test for any new variant.
6. Run `pnpm lint`, `pnpm test` and `pnpm build`, then compare the affected routes visually at 375, 768 and 1280px, in light and dark, and with reduced motion.
