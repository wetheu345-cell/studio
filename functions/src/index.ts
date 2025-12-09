/**
 * @fileOverview This is the entry point for all your backend Cloud Functions.
 *
 * This file should import and re-export all the Genkit flows that you want to
 * expose as callable endpoints. The Firebase Functions SDK will automatically
 * discover and deploy these as individual HTTP functions.
 *
 * You can then call these functions from your Next.js frontend.
 */

// It's recommended to define your flows in separate files to keep this entry point clean.
export { validateSignupCode } from './flows/validate-signup-code';
