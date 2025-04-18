/**
 * Represents a dictionary of translations.
 * This type is intentionally loose to allow for flexible nesting of translation keys.
 */
export type Dictionary = {
  [key: string]: string | Dictionary
} 