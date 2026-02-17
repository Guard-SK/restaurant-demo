import { defineCollection, z } from 'astro:content';

const menu = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        order: z.number().optional().default(99),
        name: z.string(),
        name_en: z.string().optional(),
        description_en: z.string().optional(),
        price: z.string(),
        category: z.enum(['breakfast', 'lunch', 'dinner', 'drinks']),
        subcategory: z.enum(['appetizer', 'main', 'dessert', 'alcoholic', 'non-alcoholic', 'coffee', 'soup', 'salad', 'sides', 'savoury', 'sweet', 'other']).optional(),
        allergens: z.array(z.string()).optional(),
        image: image().optional(),
        featured: z.boolean().default(false),
        lang: z.enum(['sk', 'en']).default('sk'),
    }),
});

const reviews = defineCollection({
    type: 'content',
    schema: z.object({
        author: z.string(),
        rating: z.number().min(1).max(5),
        text_en: z.string().optional(),
        source: z.enum(['Google', 'TripAdvisor', 'Facebook']).default('Google'),
        date: z.string().optional(), // Keystatic stores dates as strings usually
    }),
});

export const collections = {
    menu,
    reviews,
};
