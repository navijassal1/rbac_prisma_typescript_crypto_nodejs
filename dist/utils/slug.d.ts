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
export declare const toBaseSlug: (nameParts: string | string[]) => string;
/**
 * Generates a **unique slug** for a category (or similar resource) in the database
 * - Uses `toBaseSlug` as the base
 * - Checks existing slugs in the database
 * - Appends a numeric suffix if needed to ensure uniqueness
 *
 * @param nameParts - Name(s) used to generate slug
 * @returns Promise<string> - Unique slug string
 */
export declare const generateUniqueSlug: (nameParts: string | string[]) => Promise<string>;
//# sourceMappingURL=slug.d.ts.map