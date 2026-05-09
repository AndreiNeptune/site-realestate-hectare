import { z } from "zod";

/**
 * Validation schema for lead capture forms.
 * Constraints:
 * - nume_client: max 70 chars, trimmed.
 * - telefon: max 20 chars, trimmed.
 * - email: max 100 chars, trimmed, valid email format (optional).
 * - mesaj: max 500 chars, trimmed.
 * 
 * Custom Refinement:
 * - Reject any input containing a single "word" (string with no spaces) longer than 50 characters.
 */

const longWordRegex = /[^\s]{51,}/;

const baseSchema = z.object({
  nume_client: z
    .string()
    .trim()
    .min(1, "Numele este obligatoriu")
    .max(70, "Numele nu poate depăși 70 de caractere"),
  telefon: z
    .string()
    .trim()
    .min(1, "Numărul de telefon este obligatoriu")
    .max(20, "Numărul de telefon nu poate depăși 20 de caractere")
    .regex(/^[0-9+\s]*$/, "Numărul de telefon poate conține doar cifre, spații și simbolul '+'"),
  email: z
    .string()
    .trim()
    .email("Adresa de email nu este validă")
    .max(100, "Email-ul nu poate depăși 100 de caractere")
    .optional()
    .or(z.literal("")), // Allow empty string as valid optional
  mesaj: z
    .string()
    .trim()
    .min(1, "Mesajul este obligatoriu")
    .max(500, "Mesajul nu poate depăși 500 de caractere"),
});

// Custom refinement to detect spammy "long words"
export const leadSchema = baseSchema.superRefine((data, ctx) => {
  const fieldsToCheck = [data.nume_client, data.mesaj];
  
  for (const field of fieldsToCheck) {
    if (longWordRegex.test(field)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Te rugăm să folosești cuvinte valide (fără șiruri extrem de lungi).",
        path: field === data.nume_client ? ["nume_client"] : ["mesaj"],
      });
    }
  }
});

export type LeadFormData = z.infer<typeof leadSchema>;
