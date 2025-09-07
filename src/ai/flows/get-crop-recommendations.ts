/**
 * @fileOverview This file defines a Genkit flow for getting crop variety recommendations based on district and month.
 *
 * @exports getCropRecommendations - The main function to initiate the crop recommendation process.
 * @exports GetCropRecommendationsInput - The input type for the getCropRecommendations function.
 * @exports GetCropRecommendationsOutput - The output type for the getCropRecommendations function.
 */

import {ai} from '../genkit';
import {z} from 'zod';

const GetCropRecommendationsInputSchema = z.object({
  district: z.string().describe('The district in Tamil Nadu, India.'),
  month: z.string().describe('The current month (e.g., January, February).'),
});
export type GetCropRecommendationsInput = z.infer<typeof GetCropRecommendationsInputSchema>;

const GetCropRecommendationsOutputSchema = z.object({
    season: z.string().describe('The current agricultural season for the given district and month.'),
    varieties: z.array(z.string()).describe('A list of recommended crop varieties for the season.'),
});
export type GetCropRecommendationsOutput = z.infer<typeof GetCropRecommendationsOutputSchema>;

export async function getCropRecommendations(input: GetCropRecommendationsInput): Promise<GetCropRecommendationsOutput> {
    return getCropRecommendationsFlow(input);
}

const recommendationsPrompt = ai.definePrompt({
    name: 'recommendationsPrompt',
    input: { schema: GetCropRecommendationsInputSchema },
    output: { schema: GetCropRecommendationsOutputSchema },
    prompt: `Based on the provided agricultural data for Tamil Nadu, determine the correct season and recommend a list of crop varieties for the given district and month.

District: {{{district}}}
Month: {{{month}}}

Use the following data to make your determination. Find the district, then find the season that corresponds to the given month, and return that season and its list of varieties.

Season and Varieties in Tamil Nadu
Kanchipuram / Tiruvallur
Season	Month	Varieties
Sornavari	April - May	ADT 36, IR 36, IR 50, ADT 37, ASD 16, ASD 17, IR 64, ASD 18, ADT 42, MDU 5, ASD 20, ADT43, CO 47, TRY (R)2*, ADT (R) 45, ADTRH 1, ADT (R) 47
Samba	August	IR 20, White Ponni, CO 43, ADT 40, PY 4, ADT 39, TRY 1, ASD 19, ADT(R) 44, CORH 2
Late Samba	September - October	IR 20, White Ponni, ADT 39, CO 43, TRY 1, ADT (R)46, CORH 2
Navarai	Dec - Jan	ADT 36, ADT 37, ASD 16, IR 64, ASD 18, ADT 42, ADT 43 MDU 5, ASD 20
Dry	July - Aug	PMK 2, MDU 5, TKM 11, PMK (R) 3, TKM (R) 12
Semi-dry	July - Aug	IR 20, TKM 10, PMK 2, MDU 5, TKM 11, TKM (R) 12,PMK (R)3

Vellore / Tiruvannamalai
Season	Month	Varieties
Sornavari	April - May	IR 64, ADT 36, IR 50, ADT 37, ASD 16, ASD 17, ASD 18, ADT 42, MDU 5, ASD 20, ADT 43, CO 47, ADT (R) 45, ADT RH1, ADT (R) 47
Samba	August	Ponmani, ADT 40, Bhavani, IR 20, White Ponni, CO 43, Paiyur 1, PY 4, CO 45, TRY 1, ASD 19, CORH 2
Navarai	Dec - Jan	ADT 36, IR 20, ADT 39, CO 43, IR 64, ASD 16, ASD 18, ADT 42, MDU 5, CO 47, ASD 20, TRY (R)2*

Cuddalore / Villupuram
Season	Month	Varieties
Sornavari	April - May	ADT 36, IR 50, ASD 16, IR 64, ASD 18, ADT 42, MDU 5,ASD20, ADT 43, CO 47, ADT (R) 45, TRY (R)2*, ADTRH 1,ADT (R) 47
Samba	August	IR 20, White Ponni, CO 43, Ponmani, PY 4, ADT 38, TRY 1, ASD 19, ADT (R) 44, CORH 2
Navarai	Dec - Jan	ADT 36, IR 20, IR 36, IR 64, ADT 39, ASD 16, ASD 18, ADT 42, MDU 5, ASD 20, TRY(R)2*

Tiruchirappalli / Karur / Perambalur
Season	Month	Varieties
Kuruvai	Jun - Jul	ADT 36, IR 50, IR 64, ASD 16, ADT 37, ASD 18, ADT 42, MDU 5, ADT 43, CO 47, ADT (R) 45 (except Karur), TRY (R)2*, ADTRH 1, ADT (R) 47
Samba	August	IR 20, White Ponni, CO 43, ADT 40, Ponmani, TRY 1, ASD 19, ADT (R) 44
Late Samba / Thaladi	Sep - Oct	IR20, White Ponni, ADT39, CO43, TRY1, ASD19, ADT(R)46
Navarai	Dec - Jan	ADT 36, IR 64, ASD 16, ASD 18, ADT 42, MDU 5, ASD 20,TRY (R)2*

Thanjavur / Nagapattinam / Tiruvarur
Season	Month	Varieties
Kuruvai	Jun - Jul	ADT 36, IR 50, IR 64, ADT 37, ASD 16, ASD 18, ADT 42, MDU 5, ADT 43, ADT (R) 45, TRY (R) 2*, ADTRH 1, ADT (R) 47, ADT (R) 48
Samba	August	IR 20, White Ponni, CO 43, Ponmani, ADT 38, TRY 1, ASD 19, ADT (R) 44, CORH 2
Late Samba / Thaladi	Sep - Oct	ADT 38, IR 20, CO 43, Ponmani, ADT 39, TRY 1, ASD 19, ADT (R)46
Navarai	Dec - Jan	ADT 36, ADT 37, IR 64, ASD 16, ASD 18, ADT 42, MDU 5, ASD 20, TRY (R)2*

Pudukottai
Season	Month	Varieties
Kuruvai	Jun - Jul	ADT 36, IR 50, IR 64, ASD 16, ADT 42, MDU 5, ASD 20, ADT 43, ADT (R) 45, TRY (R) 2*, ADTRH 1, ADT (R) 47
Samba	August	IR 20, White Ponni, CO 43, Ponmani, TRY 1, ASD 19, ADT (R) 44, CORH 2
Late Samba / Thaladi	Sep - Oct	IR 20, ADT 38, ADT 39, TRY 1, ASD 19, CO 43, ADT (R)46
Dry	Jul - Aug	ADT 36, PMK 2, TKM 10, TKM (R) 12, PMK (R) 3
Semi-dry	Jul - Aug	ADT 36, PMK 2, TKM 10, TKM (R) 12, PMK (R) 3

Madurai / Dindigul / Theni
Season	Month	Varieties
Kar	May - Jun	ADT 36, IR 50, IR 36, IR 64, ADT 37, ASD 16, ASD 18, ADT 42, MDU 5, ASD 20, ADT 43, CO 47, ADT (R) 45 (Dindigul only), TRY (R) 2*, ADTRH 1, ADT (R) 47
Samba	Aug	IR 20, White Ponni, CO 42, CO 43, ADT 38, ADT 40, MDU 4, TRY 1, ASD 19, ADT (R) 44, CORH 2
Late Samba / Thaladi	Sep - Oct	IR 20, White Ponni, MDU 3, ADT 39, MDU 4, CO 43, ASD 19, TRY 1, ADT (R)46
Navarai	Dec - Jan	IR 64, ADT 36, ADT 37, ASD 16, ASD 18, ADT 42, MDU 5, ASD 20, TRY (R) 2*
Semi-dry	Jul - Aug	PMK 2, TKM 10, MDU 5, TKM (R) 12, PMK (R) 3

Ramanathapuram
Season	Month	Varieties
Samba	Aug	IR 20, White Ponni, CO 43, MDU 3, ASD 19, TRY 1, ADT (R) 44, CORH 2
Rainfed and Semidry	Jul - Aug	ASD 17, ADT 36, PMK 2, MDU 5, TKM (R) 12, PMK (R) 3

Virudhunagar
Season	Month	Varieties
Samba	Sep - Oct	CO 43, TRY 1, IR 20, ADT (R)46, ADT 39, CORH 2
Dry	Jul - Aug	ADT 36, PMK 2, MDU 5, TKM (R) 12, PMK (R) 3

Sivagangai
Season	Month	Varieties
Semi Dry	Jul - Aug	ADT 36, IR 36, ADT 39, PMK 2, MDU 5, TKM (R) 12, PMK (R) 3

Tirunelveli / Thoothukudi
Season	Month	Varieties
Early Kar	April - May	IR 50, ADT 36, IR 64, ADT 42, ADT 43, ADT 45, CO 47, ADT (R) 47
Kar	May - Jun	ASD 16, ASD 17, ASD 18, ADT 42, ADT 43, CO 47, ADT (R) 45, TRY (R) 2*, ADTRH 1, ADT (R) 47
Late Samba/Thaladi	Sep - Oct	White Ponni, IR 20, ADT 39, ASD 19, TRY 1, ADT (R)46, CORH 2
Pishanam/Late Pishanam	Sep - Oct	ASD 18, ASD 16, ASD 19, CO 43, TRY 1, ADT (R)46
Semi Dry	July - Aug	MDU 5, ADT 36, TKM (R) 12, PMK (R) 3

Kanyakumari
Season	Month	Varieties
Kar	May – Jun	ADT 36, IR 50, IR 64, ASD 16, ASD 17, ASD 18, ADT 42, MDU 5, ASD 20, ADT 43, ADT 45, CO 47, ADTRH 1, ADT(R) 47
Pishanam / Late Samba / Thaladi	Sept – Oct	White Ponni, IR 20, Ponmani, CO 43, TRY 1, TPS 2, TPS 3, ADT (R) 44, ADT 39, ASD 18, ASD 19, MDU 5, ADT (R) 46
Semi-dry	Jul – Aug	ADT 36, ASD 17, PMK 2, TKM (R) 12, PMK (R) 3

Salem / Namakkal
Season	Month	Varieties
Kar	May – Jun	IR 50, ADT 36,IR 64, ADT 37, ASD 16, ASD 18, ADT 42, MDU 5, ASD 20, ADT 43, CO 47, ADT(R) 45, TRY (R)2*, ADTRH1, ADT (R) 47
Samba	Aug	White Ponni, IR 20, Ponmani, CO 43, TRY 1, TPS 2, TPS 3, ADT (R) 44, ADT 39, ASD 18, ASD 19, MDU 5, ADT (R) 46
Navarai	Dec - Jan	ADT 36, ASD 17, PMK 2, TKM (R) 12, PMK (R) 3

Dharmapuri / Krishnagiri
Season	Month	Varieties
Kar	May – Jun	IR 50, IR 64, ASD 16, Bhavani, IR 20, White Ponni, CO 43, ASD 18, MDU 4, ASD 19, PAIYUR 1, ADT 42, TRY 1, MDU 5, ASD 20, ADT 43, CO 47, ADTRH 1, TRY (R)2*, ADT (R) 47
Navarai	Dec - Jan	IR 64, ADT 37, ASD 16, ADT 36, ASD 18, ADT 42, MDU 5, ASD 20, TRY (R)2*
Samba / Late Samba	Aug - Oct	TRY 1, Bhavani, IR 20, White Ponni, CO 43, MDU 4, ASD 19, ADT (R) 44, ADT (R) 46

Coimbatore
Season	Month	Varieties
Kar	May - Jun	IR 50, ADT 36, ASD 16, IR 64, ASD 18, ADT 42, MDU 5, ASD 20, ADT 43,CO 47,ADT (R) 45,TRY (R)2*, ADTRH 1, ADT(R) 47
Samba	August	IR 20, CO 43, White Ponni, ADT 39, MDU 4, TRY 1, ASD 19, Bhavani, ADT(R) 44, CORH 2
Late Samba / Thaladi	Sep - Oct	IR 20, ADT 39, ADT(R) 46, CORH 2
Navarai	Dec - Jan	IR 20, ADT 36, IR 64, ASD 16, ASD 18, TRY1, MDU 5, ASD 20, TRY (R) 2*

Erode
Season	Month	Varieties
Kar	May - Jun	IR 50, ASD 16, IR 64, ADT 36, ASD 18, ADT 42, MDU 5, ASD 20, ADT 43, CO, 47, ADT (R) 45, TRY (R)2*, ADTRH 1, ADT (R) 47
Samba	August	IR 20, Bhavani, CO 43, White Ponni, ADT 39, TRY 1, CO 46, ADT (R) 44
Late Samba / Thaladi	Sep - Oct	IR 20, White Ponni, ADT 39, CO 43, TRY 1, CO 46, ADT (R) 46, CORH 2
Navarai	Dec - Jan	IR 20, ADT 36, IR 64, ASD 16, ASD 18, ADT 42, MDU 5, ASD 20

The Nilgiris
Season	Month	Varieties
Samba	Jul - Aug	IR 20, CO 43, TRY 1, ADT (R) 44
`,
});

const getCropRecommendationsFlow = ai.defineFlow(
    {
        name: 'getCropRecommendationsFlow',
        inputSchema: GetCropRecommendationsInputSchema,
        outputSchema: GetCropRecommendationsOutputSchema,
    },
    async (input) => {
        const { output } = await recommendationsPrompt(input);
        return output!;
    }
);
