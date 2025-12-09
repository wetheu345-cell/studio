'use server';
/**
 * @fileOverview A server-side flow to validate admin registration codes.
 *
 * - validateSignupCode - A function that securely checks if a provided code is valid.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ValidateCodeInputSchema = z.object({
  registrationCode: z.string().describe('The registration code entered by the user.'),
});

const ValidateCodeOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the provided registration code is valid.'),
});

/**
 * Securely validates a registration code on the server.
 * @param input The registration code.
 * @returns An object indicating if the code is valid.
 */
export async function validateSignupCode(
  registrationCode: string
): Promise<{ isValid: boolean }> {
  return validateSignupCodeFlow({ registrationCode });
}

const validateSignupCodeFlow = ai.defineFlow(
  {
    name: 'validateSignupCodeFlow',
    inputSchema: ValidateCodeInputSchema,
    outputSchema: ValidateCodeOutputSchema,
  },
  async (input) => {
    // This logic runs on the server, so process.env is secure.
    const isValid = input.registrationCode === process.env.PRIVATE_SIGNUP_CODE;
    return { isValid };
  }
);
