import {genkit, Flow} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { firebase } from 'genkit/plugins';
import { defineFlow, run, startFlow } from '@genkit-ai/flow';
import { fromFlow, onRequest } from 'firebase-functions/v2/genkit';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI(),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
