## SVG

Approach:

1. all symbols in one svg - many uses
2. define svg with symbol - and reuse it
   1. problem: if u remove svg from dom it can broke all refs

```html mark="uniqueid" {3}
<!-- Define -->
<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
  <symbol id="uniqueid" viewBox="...">
    <!-- contents of /uniqueid.svg -->
  </symbol>
</svg>
<!-- Use -->
<svg viewBox="0 0 100 100" class="icon shape-codepen">
  <use xlink:href="#shape-codepen"></use>
</svg>
```

```astro mark="uniqueid" {12,13,20}
---
import { Icon } from 'astro-icon/components'
---

<Icon name="logo" />
<!-- First usage generates the following HTML -->
<svg data-icon="logo">
  <symbol id="ai:uniqueid"><!-- contents of /src/icons/logo.svg --></symbol>
  <use xlink:href="#ai:uniqueid"></use>
</svg>

<Icon name="logo" />
<!-- Additional usage generates the following HTML -->
<svg data-icon="logo">
  <use xlink:href="#ai:uniqueid"></use>
</svg>
```
