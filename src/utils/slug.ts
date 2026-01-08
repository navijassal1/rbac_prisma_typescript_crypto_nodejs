import prisma from "../lib/prisma.client.js";

/**
 * Converts a string or array of strings into a "base slug"
 * - Removes non-alphanumeric characters
 * - Replaces spaces and special characters with hyphens
 * - Converts to lowercase
 * - Ensures uniqueness of words within the slug
 * 
 * @param nameParts - A string or array of strings (e.g., category name)
 * @returns string - Base slug (e.g., "my-category-name")
 */
export const toBaseSlug = (nameParts: string | string[]): string => {
    // Clean a single string: trim, lowercase, remove special chars, replace spaces with hyphen
    const clean = (str: string): string => {
        str = str
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")  // replace non-alphanumeric with '-'
            .replace(/^-+|-+$/g, "");     // remove leading/trailing '-'
        return str;
    };

    // Ensure parts is an array
    const parts: string[] = Array.isArray(nameParts) ? nameParts : [nameParts];

    // Flatten and clean parts, remove duplicate words
    const base: string[] = [...new Set(
        parts.flatMap((item) => clean(item).split(' ')) // split cleaned string by spaces
    )];

    return base.join('-'); // join words with hyphens
};

/**
 * Generates a **unique slug** for a category (or similar resource) in the database
 * - Uses `toBaseSlug` as the base
 * - Checks existing slugs in the database
 * - Appends a numeric suffix if needed to ensure uniqueness
 * 
 * @param nameParts - Name(s) used to generate slug
 * @returns Promise<string> - Unique slug string
 */
export const generateUniqueSlug = async (nameParts: string | string[]): Promise<string> => {
    const baseSlug = toBaseSlug(nameParts);

    // Find all slugs in the database that start with the baseSlug
    const similarSlugs = await prisma.category.findMany({
        where: {
            slug: {
                startsWith: baseSlug
            }
        },
        select: {
            slug: true
        }
    });

    // If no existing slugs, return baseSlug directly
    if (similarSlugs.length === 0) return baseSlug;

    // Track used numeric suffixes
    const usedNumber = new Set<number>();

    similarSlugs.forEach((row) => {
        if (baseSlug === row.slug) {
            usedNumber.add(0); // baseSlug itself is already used
        } else {
            const split = row.slug.split('-');
            const last = Number(split[split.length - 1]);
            if (!isNaN(last)) {
                usedNumber.add(last); // add numeric suffix if present
            }
        }
    });

    // Find the smallest unused number to append
    let n = 0;
    while (usedNumber.has(n)) {
        n++;
    }

    return n === 0 ? baseSlug : `${baseSlug}-${n}`;
};
