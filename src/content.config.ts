import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const lessons = defineCollection({
  loader: glob({ pattern: "**/[0-9]*.md", base: "./lessons" }),
  schema: z.object({}).passthrough(),
});

const tips = defineCollection({
  loader: glob({ pattern: "**/tip.md", base: "./tips" }),
  schema: z.object({}).passthrough(),
});

export const collections = { lessons, tips };
