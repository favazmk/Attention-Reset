/**
 * Single source of truth for what the programme costs, server-side.
 *
 * The client displays a price but never gets to choose one — every order is
 * created at PRICE_PAISE and every entitlement grant re-checks the amount that
 * Razorpay actually captured against this value.
 */
export const PRICE_RUPEES = 99;
export const PRICE_PAISE = PRICE_RUPEES * 100;
export const CURRENCY = 'INR';
