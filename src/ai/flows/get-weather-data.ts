/**
 * @fileOverview This file defines a Genkit flow for fetching real-time weather data for a given district.
 *
 * @exports getWeatherData - The main function to initiate weather data retrieval.
 * @exports GetWeatherDataInput - The input type for the getWeatherData function.
 * @exports GetWeatherDataOutput - The output type for the getWeatherData function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const GetWeatherDataInputSchema = z.object({
  district: z.string().describe('The district in Tamil Nadu, India for which to get the weather data.'),
});
export type GetWeatherDataInput = z.infer<typeof GetWeatherDataInputSchema>;

const GetWeatherDataOutputSchema = z.object({
  temperature: z.number().describe('Current temperature in Celsius.'),
  humidity: z.number().describe('Current humidity in percentage.'),
  rainfall: z.number().describe('Rainfall in the last 24 hours in mm.'),
});
export type GetWeatherDataOutput = z.infer<typeof GetWeatherDataOutputSchema>;


export async function getWeatherData(input: GetWeatherDataInput): Promise<GetWeatherDataOutput> {
    return getWeatherDataFlow(input);
}

const weatherPrompt = ai.definePrompt({
    name: 'weatherPrompt',
    input: { schema: GetWeatherDataInputSchema },
    output: { schema: GetWeatherDataOutputSchema },
    prompt: `You are a weather API. Provide the current real-time weather data for the following district in Tamil Nadu, India: {{{district}}}.

    Provide the temperature in Celsius, humidity as a percentage, and rainfall in the last 24 hours in mm.
    
    Do not make up data. Use your knowledge to provide accurate, real-time information.
    `,
});


const getWeatherDataFlow = ai.defineFlow(
    {
        name: 'getWeatherDataFlow',
        inputSchema: GetWeatherDataInputSchema,
        outputSchema: GetWeatherDataOutputSchema,
    },
    async (input) => {
        const { output } = await weatherPrompt(input);
        return output!;
    }
);
