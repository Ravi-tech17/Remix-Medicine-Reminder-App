import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  try {
    console.log('Generating image...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: 'A modern Medication Reminder Mobile App UI design, clean and professional healthcare theme. Three smartphone screens displayed side-by-side showing: Welcome screen with text "Your daily health partner", Home dashboard with calendar, medicine schedule, reminders, progress stats, Medicine details screen showing dosage, time, pills, and progress. Soft blue, teal, and mint green gradient background, smooth curved shapes. Minimalist medical illustrations including pills, capsules, syringe, clipboard, and healthcare professionals at the bottom. Flat vector style, rounded UI cards, soft shadows, high readability. Friendly, trustworthy, calming medical design suitable for a health reminder app. Full-screen background, clean typography, modern mobile app mockup. Professional UI/UX, healthcare startup style, high resolution.',
          },
        ],
      },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const publicDir = path.join(process.cwd(), 'public');
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        fs.writeFileSync(path.join(publicDir, 'hero-mockup.png'), Buffer.from(base64EncodeString, 'base64'));
        console.log('Image saved to public/hero-mockup.png');
        return;
      }
    }
    console.log('No image data found in response.');
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generate();
