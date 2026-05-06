# vimmer.io

**Live site: [vim.manycoolprojects.com](https://vim.manycoolprojects.com)**

A free, browser-based Vim tutorial. Each lesson step embeds a real Vim
instance compiled to WebAssembly — you read the prose, then practise in the
editor below it without leaving the page. Works best in Chrome.

This is a revival of the original [vimmer.io](https://github.com/vimmer-io/vimmer.io),
which had been sunset as a paid product. The lesson content under
[`lessons/`](lessons/) and [`tips/`](tips/) is the upstream's work, unchanged;
everything else is a static rebuild around it.

## Stack

- [Astro](https://astro.build) — static-site generator
- [vim.wasm](https://github.com/rhysd/vim.wasm) — Vim 8.2 compiled to WebAssembly
- Hosted on Cloudflare Pages

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
```

The `vim.wasm` runtime files (`vim.js`, `vim.wasm`, `vim.data`) are copied
from `node_modules/vim-wasm/` into `public/vim-wasm/` by a `prebuild` /
`predev` step, so they don't need to be committed.

---

## 🌅 Original sunset note

> **vimmer.io has been sunset. [The lessons/tips are now available here for
> free](https://github.com/vimmer-io/vimmer.io).**
>
> Unfortunately, I could no longer justify the time/money investment to continue
> the project. It has been fun — thank you to those that paid for and enjoyed the
> product over the past few years.
