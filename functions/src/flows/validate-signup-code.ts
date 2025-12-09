/**
 * @fileOverview A server-side flow to validate admin registration codes.
 */
import { ai } from '../genkit';
import { z } from 'genkit';
import { fromFlow } from '@genkit-ai/firebase-functions';
import { HttpsOptions } from 'firebase-functions/v2/https';


const ValidateCodeInputSchema = z.object({
  registrationCode: z.string().describe('The registration code entered by the user.'),
});

const ValidateCodeOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the provided registration code is valid.'),
});

/**
 * Securely validates a registration code on the server.
 */
export const validateSignupCodeFlow = ai.defineFlow(
  {
    name: 'validateSignupCodeFlow',
    inputSchema: ValidateCodeInputSchema,
    outputSchema: ValidateCodeOutputSchema,
  },
  async (input) => {
    // This logic runs on the server, so process.env is secure.
    const validCode = process.env.PRIVATE_SIGNUP_CODE || 'EHW_ADMIN2024!';
    const isValid = input.registrationCode === validCode;
    return { isValid };
  }
);


// Export the flow as a Firebase Function
const httpsOptions: HttpsOptions = {
    cors: true, // Allow requests from any origin
};

export const validateSignupCode = fromFlow(validateSignupCodeFlow, httpsOptions);
