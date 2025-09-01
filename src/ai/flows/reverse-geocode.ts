'use server';

/**
 * @fileOverview This file defines a Genkit flow for reverse geocoding coordinates to a district in Tamil Nadu, India.
 *
 * @exports reverseGeocode - The main function to initiate the reverse geocoding process.
 * @exports ReverseGeocodeInput - The input type for the reverseGeocode function.
 * @exports ReverseGeocodeOutput - The output type for the reverseGeocode function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const ReverseGeocodeInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type ReverseGeocodeInput = z.infer<typeof ReverseGeocodeInputSchema>;

const ReverseGeocodeOutputSchema = z.object({
  district: z.string().describe('The identified district in Tamil Nadu, India.'),
});
export type ReverseGeocodeOutput = z.infer<typeof ReverseGeocodeOutputSchema>;

export async function reverseGeocode(input: ReverseGeocodeInput): Promise<ReverseGeocodeOutput> {
    return reverseGeocodeFlow(input);
}

const reverseGeocodePrompt = ai.definePrompt({
    name: 'reverseGeocodePrompt',
    input: { schema: ReverseGeocodeInputSchema },
    output: { schema: ReverseGeocodeOutputSchema },
    prompt: `Given the latitude {{{latitude}}} and longitude {{{longitude}}}, identify the corresponding district in the state of Tamil Nadu, India.

    Your response should only contain the district name. If the location is outside Tamil Nadu, state that the location is not in Tamil Nadu.
    `,
});

const reverseGeocodeFlow = ai.defineFlow(
    {
        name: 'reverseGeocodeFlow',
        inputSchema: ReverseGeocodeInputSchema,
        outputSchema: ReverseGeocodeOutputSchema,
    },
    async (input) => {
        const { output } = await reverseGeocodePrompt(input);
        return output!;
    }
);
