# MIT-WPU page templates, vendored

Copied verbatim from `mitwpu-website-demo` at commit `a14322949bf2ac8e2bef3079ffb36197d1ab8ae6`:

| File | Source |
|---|---|
| `base.css` | `group-assets/site.css` |
| `profile.css` | `people/profile.css` |
| `university.css` | `university-sections/_assets/university.css` |

MIT Mumbai's people directory, faculty profiles and leadership page render the
same markup these stylesheets were written for, so the two sites share one
template rather than two implementations of the same idea. Only the palette
differs — `assets/wpu-overrides.css` remaps the custom properties to MIT
Mumbai's crimson and blue.

The one edit made on copy: `profile.css`'s `@import` of the base stylesheet
was repointed at the local filename.

These belong in `university-web-patterns` as shared, data-free patterns. They
are vendored here because they are not there yet; promoting them is the right
next step, not copying them a third time.
