/**
 * Utility functions for formatting values
 */

/**
 * Format price with currency
 */
export const formatPrice = (price: number, currencySymbol: string = 'د.إ'): string => {
  return `${currencySymbol} ${price.toFixed(2)}`;
};

/**
 * Format price in AED
 */
export const formatAED = (price: number): string => {
  return formatPrice(price, 'د.إ');
};

/**
 * Format rating with decimal
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (price: number, discountPercent: number): number => {
  return price * discountPercent;
};

/**
 * Calculate final price after discount
 */
export const calculateFinalPrice = (price: number, discountPercent: number): number => {
  return price * (1 - discountPercent);
};

/**
 * Validate promo code
 */
export const validatePromoCode = (code: string): boolean => {
  const validCodes = ['SAVE10', 'SAVE20', 'WELCOME', 'DISCOUNT5'];
  return validCodes.includes(code.toUpperCase());
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

