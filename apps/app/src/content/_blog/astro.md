---
title: "SST vs Astro"
description: "Lorem ipsum dolor sit amet"
pubDate: "Jul 08 2022"
heroImage: "/blog-placeholder-3.jpg"
---

## Key Differences

1. The `<script>` is
   1. `<script type="module">` in `<head>`,
   2. **deduplicated**,
   3. **defered**,
   4. both `content` and `src="x.ts"` is **transpiled**.
2. Astro has **compile time only**:
   1. `<slot>`
   2. `jsx`
3. Astro does not translate `jsx` to `jsx` adapters like `react`.
4. For components with a `client:*` directive, Astro creates an `<astro-island>` custom element with a props attribute that stores your server-side props in the HTML output.
5. Astro force u to use **Renderless Web Components**
6. The great thing about LitHtml is that we can use it update the DOM very efficiently and, when applied repeatedly, only modify the elements that need changing. If there are any event listeners attached, LitHtml will leave them unharmed.
7. `Astro.glob` is `glob` with parser. Can be used for custom loader or service locator impl.
