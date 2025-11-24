import { defineCollection, z } from 'astro:content';

const skills = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.string(),
    proficiency: z.number().min(1).max(100),
    description: z.string().optional(),
    icon: z.string().optional(),
    is_active: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    price: z.number().optional(),
    duration: z.string().optional(),
    is_active: z.boolean().default(true),
    features: z.array(z.string()).optional(),
    icon: z.string().optional(),
    order: z.number().default(0),
  }),
});

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Admin'),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    is_active: z.boolean().default(true),
  }),
});

const podcasts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    duration: z.string(),
    audioUrl: z.string(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    is_active: z.boolean().default(true),
  }),
});

export const collections = {
  skills,
  services,
  posts,
  podcasts,
};
