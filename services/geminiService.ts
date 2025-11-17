import { GoogleGenAI, Modality } from "@google/genai";

// FIX: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY directly.
// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function editImageWithGemini(
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error("Nenhuma imagem foi retornada pela API.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // FIX: Add type check for error object before accessing properties for safer error handling.
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("Chave de API inválida. Por favor, verifique suas credenciais.");
    }
    throw new Error("Falha ao editar a imagem com a IA.");
  }
}
