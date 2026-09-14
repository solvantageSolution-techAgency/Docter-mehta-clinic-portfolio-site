import OpenAI from "openai";
import { doctor } from "@/data/doctor";
import { faqs } from "@/data/faqs";
import { treatments } from "@/data/treatments";
import dotenv from 'dotenv'
dotenv.config()



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const knowledge = {
  doctor,
  faqs,
  treatments,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return Response.json(
        { error: "Invalid messages" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are the official website assistant for Mehta Care Clinic
and Dr. Aarav Mehta.

Your job is to help website visitors with:
- clinic information
- doctor information
- treatments listed on the website
- frequently asked questions
- appointment information
- contact information

IMPORTANT MEDICAL SAFETY RULES:

1. Do not diagnose patients.
2. Do not prescribe medicines.
3. Do not recommend changing, starting, or stopping medication.
4. Do not provide individualized treatment plans.
5. Do not claim certainty about a medical condition.
6. For potentially serious or emergency symptoms, recommend
   urgent medical evaluation.
7. If the answer is not present in the provided clinic information,
   say that you don't have that information and recommend contacting
   the clinic.
8. Do not invent clinic information.
9. Keep answers concise, friendly and easy to understand.
10. When appropriate, encourage the visitor to book a consultation.

Here is the official clinic information:

${JSON.stringify(knowledge, null, 2)}
      `,

      input: messages,
    });

    return Response.json({
      message: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Unable to process your request" },
      { status: 500 }
    );
  }
}