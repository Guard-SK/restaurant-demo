import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: import.meta.env.PROD ? {
        kind: 'github',
        repo: 'Guard-SK/lunar-bistro-demo',
    } : {
        kind: 'local',
    },
    collections: {
        menu: collection({
            label: 'Menu',
            slugField: 'slug',
            path: 'src/content/menu/**',
            format: { contentField: 'description' },
            schema: {
                slug: fields.slug({
                    name: {
                        label: 'URL Adresa (Slug)',
                        description: 'Unikátny identifikátor pre URL adresu. Používajte iba malé písmená, čísla a pomlčky (napr. maslovy-croissant).',
                    }
                }),
                order: fields.integer({
                    label: 'Poradie (Order)',
                    description: 'Číslo pre manuálne zoradenie položiek (nižšie číslo = vyššie v zozname)',
                    defaultValue: 99,
                }),
                name: fields.text({ label: 'Názov Jedla' }),
                name_en: fields.text({ label: 'Názov Jedla (Anglicky)' }),
                description: fields.markdoc({
                    label: 'Popis',
                    extension: 'md',
                }),
                description_en: fields.text({
                    label: 'Popis (Anglický)',
                    description: 'Popis jedla v anglickom jazyku, dôležité pre funkčnosť stránky.',
                    multiline: true,
                }),
                price: fields.text({ label: 'Cena (napr. 12.50€)' }),
                category: fields.select({
                    label: 'Kategória',
                    options: [
                        { label: 'Raňajky (Breakfast)', value: 'breakfast' },
                        { label: 'Obed (Lunch)', value: 'lunch' },
                        { label: 'Večera (Dinner)', value: 'dinner' },
                        { label: 'Nápoje (Drinks)', value: 'drinks' },
                    ],
                    defaultValue: 'lunch',
                }),
                subcategory: fields.select({
                    label: 'Podkategória (Subcategory)',
                    options: [
                        { label: 'Predjedlo (Appetizer)', value: 'appetizer' },
                        { label: 'Polievka (Soup)', value: 'soup' },
                        { label: 'Hlavné jedlo (Main Dish)', value: 'main' },
                        { label: 'Šalát (Salad)', value: 'salad' },
                        { label: 'Prílohy (Sides)', value: 'sides' },
                        { label: 'Dezert (Dessert)', value: 'dessert' },
                        { label: 'Slané (Savoury Breakfast)', value: 'savoury' },
                        { label: 'Sladké (Sweet Breakfast)', value: 'sweet' },
                        { label: 'Káva (Coffee)', value: 'coffee' },
                        { label: 'Alkoholické (Alcoholic)', value: 'alcoholic' },
                        { label: 'Nealkoholické (Non-Alcoholic)', value: 'non-alcoholic' },
                        { label: 'Ostatné (Other)', value: 'other' },
                    ],
                    defaultValue: 'main',
                }),
                allergens: fields.multiselect({
                    label: 'Alergény / Diétne',
                    options: [
                        { label: 'Vegan', value: 'vegan' },
                        { label: 'Vegetariánske (Vegetarian)', value: 'vegetarian' },
                        { label: 'Lepok (Gluten)', value: 'gluten' },
                        { label: 'Mliečne (Dairy)', value: 'dairy' },
                        { label: 'Orechy (Nuts)', value: 'nuts' },
                        { label: 'Vajcia (Eggs)', value: 'eggs' },
                        { label: 'Ryby (Fish)', value: 'fish' },
                        { label: 'Zeler (Celery)', value: 'celery' },
                        { label: 'Siričitany (Sulphites)', value: 'sulphites' },
                        { label: 'Semienka (Seeds)', value: 'seeds' },
                        { label: 'Pikantné (Spicy)', value: 'spicy' },
                    ],
                    defaultValue: [],
                }),
                image: fields.image({
                    label: 'Fotka Jedla',
                    directory: 'src/assets/menu',
                    publicPath: '../../assets/menu/',
                }),
                featured: fields.checkbox({ label: 'Odporúčané Šéfkuchárom', defaultValue: false }),
                lang: fields.select({
                    label: 'Jazyk',
                    options: [
                        { label: 'Slovenský', value: 'sk' },
                        { label: 'Anglický', value: 'en' },
                    ],
                    defaultValue: 'sk',
                }),
            },
        }),
        reviews: collection({
            label: 'Recenzie (Reviews)',
            slugField: 'author',
            path: 'src/content/reviews/**',
            format: { contentField: 'text_sk' },
            schema: {
                author: fields.slug({ name: { label: 'Meno autora (Author Name)' } }),
                rating: fields.integer({
                    label: 'Hodnotenie (Rating 1-5)',
                    validation: { min: 1, max: 5 },
                    defaultValue: 5,
                }),
                text_sk: fields.markdoc({
                    label: 'Text recenzie (SK)',
                    extension: 'md',
                }),
                text_en: fields.text({
                    label: 'Text recenzie (EN)',
                    multiline: true,
                }),
                source: fields.select({
                    label: 'Zdroj',
                    options: [
                        { label: 'Google', value: 'Google' },
                        { label: 'TripAdvisor', value: 'TripAdvisor' },
                        { label: 'Facebook', value: 'Facebook' },
                    ],
                    defaultValue: 'Google',
                }),
                date: fields.date({ label: 'Dátum (Date)' }),
            },
        }),
    },
});
