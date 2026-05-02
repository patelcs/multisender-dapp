/**
 * ========================================================
 *  ADDRESS BOOK TAGS CONFIGURATION
 * ========================================================
 *
 * Default tags available for all users. 
 * Users can also add their own custom tags.
 */

export const DEFAULT_ADDRESS_TAGS = ["Contact", "Contract"] as const;

export type DefaultAddressTag = (typeof DEFAULT_ADDRESS_TAGS)[number];

/**
 * Helper to check if a tag is a default tag.
 */
export function isDefaultTag(tag: string): tag is DefaultAddressTag {
  return (DEFAULT_ADDRESS_TAGS as readonly string[]).includes(tag);
}
