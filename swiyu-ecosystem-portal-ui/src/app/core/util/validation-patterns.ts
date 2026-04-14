/**
 * Pattern Breakdown:
 * ^(?:\+41|0041)   -> Matches prefix +41 or 0041
 * \s?              -> Optional space
 * [1-9]\d     -> 2-digit provider code
 * \s?\d{3}         -> Optional space and 3 digits
 * (?:\s?\d{2}){2}  -> Group of (space + 2 digits) repeated twice
 * $                -> End of string
 */
export const SWISS_PHONE_PATTERN = /^(?:\+41|0041)\s?[1-9]\d\s?\d{3}(?:\s?\d{2}){2}$/;

/**
 * Pattern Breakdown:
 * ^CHE             -> Must start with the prefix 'CHE'
 * (?:              -> Start non-capturing group for the numeric part
 * -?\d{3}\.      -> Optional hyphen, 3 digits, and a dot
 * \d{3}\.        -> 3 digits and a dot
 * \d{3}          -> The final 3 digits
 * |              -> OR (alternation)
 * \d{9}          -> Exactly 9 digits without any separators
 * )                -> End non-capturing group
 * $                -> End of string
 */
export const SWISS_UID_PATTERN = /^CHE(?:-?\d{3}\.\d{3}\.\d{3}|\d{9})$/;
