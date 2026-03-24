// eslint-disable-next-line import/no-unresolved -- ok
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    // Advanced: Validate that the string is also a URL
    canonicalURL: z.string().url().optional(),
  }),
});

export const collections = { blog };
