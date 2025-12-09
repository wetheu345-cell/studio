import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { firebase } from '@genkit-ai/firebase';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI(),
  ],
  enableTracingAndMetrics: true,
});
