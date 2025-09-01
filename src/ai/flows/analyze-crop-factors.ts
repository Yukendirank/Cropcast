'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the most influential factors affecting crop yield based on user input.
 *
 * @exports analyzeCropFactors - The main function to initiate the crop factor analysis.
 * @exports AnalyzeCropFactorsInput - The input type for the analyzeCropFactors function.
 * @exports AnalyzeCropFactorsOutput - The output type for the analyzeCropFactors function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const AnalyzeCropFactorsInputSchema = z.object({
  rainfall: z.number().describe('Rainfall in mm.'),
  temperature: z.number().describe('Average temperature in Celsius.'),
  humidity: z.number().describe('Average humidity percentage.'),
  soil_type: z.string().describe('Type of soil (e.g., Loamy, Sandy, Clay).'),
  soil_ph: z.number().describe('Soil pH level.'),
  fertilizer_use: z.string().describe('Level of fertilizer use (e.g., Low, Moderate, High).'),
  irrigation: z.string().describe('Type of irrigation (e.g., Drip, Sprinkler, None).'),
  pest_control: z.boolean().describe('Whether pest control is used.'),
  crop_variety: z.string().describe('Variety of the crop (e.g., Hybrid-Maize).'),
  disease_presence: z.boolean().describe('Whether disease is present.'),
});
export type AnalyzeCropFactorsInput = z.infer<typeof AnalyzeCropFactorsInputSchema>;

const AnalyzeCropFactorsOutputSchema = z.object({
  factor_ranking: z.array(
    z.object({
      factor: z.string().describe('The name of the factor.'),
      impact: z.string().describe('The impact level of the factor on crop yield (High, Moderate, Low).'),
      reason: z.string().describe('Reasoning behind the impact level assigned to the factor based on the inputs.'),
    })
  ).describe('A ranked list of factors influencing crop yield, with their impact level and reasoning.')
});
export type AnalyzeCropFactorsOutput = z.infer<typeof AnalyzeCropFactorsOutputSchema>;

export async function analyzeCropFactors(input: AnalyzeCropFactorsInput): Promise<AnalyzeCropFactorsOutput> {
  return analyzeCropFactorsFlow(input);
}

const analyzeFactorsPrompt = ai.definePrompt({
  name: 'analyzeFactorsPrompt',
  input: {schema: AnalyzeCropFactorsInputSchema},
  output: {schema: AnalyzeCropFactorsOutputSchema},
  prompt: `You are an expert agricultural analyst. Given the following data about a crop, identify and rank the most influential factors affecting crop yield. Explain the reasoning behind each factor's impact.

Data:
Rainfall: {{{rainfall}}} mm
Temperature: {{{temperature}}} Celsius
Humidity: {{{humidity}}}%
Soil Type: {{{soil_type}}}
Soil pH: {{{soil_ph}}}
Fertilizer Use: {{{fertilizer_use}}}
Irrigation: {{{irrigation}}}
Pest Control: {{#if pest_control}}Yes{{else}}No{{/if}}
Crop Variety: {{{crop_variety}}}
Disease Presence: {{#if disease_presence}}Yes{{else}}No{{/if}}

Rank the factors as High, Moderate, or Low impact.

Output the results as a JSON object with a \"factor_ranking\" field that contains an array of objects. Each object should have \"factor\", \"impact\", and \"reason\" fields.
`, 
});

const analyzeCropFactorsFlow = ai.defineFlow(
  {
    name: 'analyzeCropFactorsFlow',
    inputSchema: AnalyzeCropFactorsInputSchema,
    outputSchema: AnalyzeCropFactorsOutputSchema,
  },
  async input => {
    const {output} = await analyzeFactorsPrompt(input);
    return output!;
  }
);
