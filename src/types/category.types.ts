/**
 * Parameters required to create a new category.
 */
export interface CategoryNameParams {
    /** The name of the category to create */
    category_name: string;
}
/**
 * Parameters required to update an existing category.
 * Currently identical to `CategoryNameParams`, but separated for clarity and future extensions.
 */
export interface UpdateCategoryParams {
    /** The new name of the category */
    category_name: string;
}
