'use server';

/**
 * @fileOverview A flow that suggests relevant analyses for adherence data within a selected time window.
 *
 * - suggestRelevantAnalysis - A function that suggests relevant analyses based on the input data and time window.
 * - SuggestRelevantAnalysisInput - The input type for the suggestRelevantAnalysis function.
 * - SuggestRelevantAnalysisOutput - The return type for the suggestRelevantAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantAnalysisInputSchema = z.object({
  timeSeriesData: z.array(
    z.object({
      timestamp: z.number().describe('Unix timestamp of the data point.'),
      adherenceRate: z.number().describe('Adherence rate at the given timestamp (0 to 1).'),
      otherVariables: z.record(z.string(), z.any()).optional().describe('Other relevant clinical measures for correlation analysis.'),
    })
  ).describe('Time series data of medication adherence.'),
  startTime: z.number().describe('The start timestamp of the selected time window.'),
  endTime: z.number().describe('The end timestamp of the selected time window.'),
  additionalContext: z.string().optional().describe('Any additional context or information about the data.'),
});
export type SuggestRelevantAnalysisInput = z.infer<typeof SuggestRelevantAnalysisInputSchema>;

const SuggestRelevantAnalysisOutputSchema = z.object({
  suggestedAnalyses: z.array(
    z.object({
      analysisType: z.string().describe('The type of analysis suggested (e.g., trend detection, seasonality analysis, anomaly detection).'),
      description: z.string().describe('A detailed description of the analysis and why it is relevant to the given data.'),
      rationale: z.string().describe('The rationale behind suggesting this particular analysis, based on the data characteristics.'),
    })
  ).describe('A list of suggested analyses with their descriptions and rationales.'),
});
export type SuggestRelevantAnalysisOutput = z.infer<typeof SuggestRelevantAnalysisOutputSchema>;

export async function suggestRelevantAnalysis(input: SuggestRelevantAnalysisInput): Promise<SuggestRelevantAnalysisOutput> {
  return suggestRelevantAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantAnalysisPrompt',
  input: {schema: SuggestRelevantAnalysisInputSchema},
  output: {schema: SuggestRelevantAnalysisOutputSchema},
  prompt: `You are an expert data analyst specializing in medication adherence patterns.

You are provided with time series data of medication adherence rates within a specific time window. Your task is to suggest relevant analyses that can help identify statistically significant trends and insights.

Consider factors like trends, seasonality, anomalies, and correlations with other available variables.

Time Window Start: {{{startTime}}}
Time Window End: {{{endTime}}}

Time Series Data:
{{#each timeSeriesData}}
  Timestamp: {{{timestamp}}}, Adherence Rate: {{{adherenceRate}}}{{#if otherVariables}}, Other Variables: {{json otherVariables}}{{/if}}
{{/each}}

Additional Context: {{{additionalContext}}}

Based on this data, suggest at least three relevant analyses that would be helpful to a researcher. For each analysis, provide a detailed description and the rationale behind your suggestion.

Format your response as a JSON array of analysis suggestions.
`,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestRelevantAnalysisFlow = ai.defineFlow(
  {
    name: 'suggestRelevantAnalysisFlow',
    inputSchema: SuggestRelevantAnalysisInputSchema,
    outputSchema: SuggestRelevantAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
