import { GoogleGenAI } from '@google/genai';
import { AIQuizResponseSchema, AIQuizRequest, AIQuizResponse } from '../schemas/aiQuizSchema';

export class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenAI({
      apiKey: apiKey
    });
  }

  /**
   * Generate quiz questions using Gemini AI
   */
  async generateQuizQuestions(request: AIQuizRequest): Promise<AIQuizResponse> {
    const prompt = this.buildPrompt(request);
    
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      });
      
      const text = response.text;
      
      // Check if text is defined
      if (!text) {
        throw new Error('No text response from AI');
      }
      
      // Clean the response - remove markdown code blocks if present
      let cleanedText = text.trim();
      
      // Remove ```json and ``` markers
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      cleanedText = cleanedText.trim();
      
      // Parse the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', cleanedText);
        throw new Error('Invalid JSON response from AI');
      }
      
      // Validate the response using Zod
      const validatedResponse = AIQuizResponseSchema.parse(parsedResponse);
      
      return validatedResponse;
    } catch (error) {
      console.error('Error generating quiz with Gemini:', error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        throw new Error(`AI response validation failed: ${error.message}`);
      }
      
      throw new Error('Failed to generate quiz questions');
    }
  }

  /**
   * Build the prompt for Gemini AI
   */
  private buildPrompt(request: AIQuizRequest): string {
    const difficultyDescriptions = {
      easy: 'basic concepts and fundamentals that a beginner should know',
      medium: 'intermediate concepts requiring some experience and understanding',
      hard: 'advanced concepts requiring deep knowledge and complex problem-solving'
    };

    return `You are an expert quiz creator. Generate ${request.questionCount} multiple-choice questions about "${request.topic}" at ${request.difficulty} level.

IMPORTANT REQUIREMENTS:
1. Each question should test ${difficultyDescriptions[request.difficulty]}
2. Provide exactly 4 options (A, B, C, D) for each question
3. Only ONE option should be correct
4. Include a clear explanation for why the correct answer is right
5. Make questions practical and relevant to real-world scenarios
6. Avoid trick questions or overly ambiguous wording

RESPONSE FORMAT (JSON ONLY):
{
  "questions": [
    {
      "question": "Your question text here?",
      "options": {
        "A": "First option",
        "B": "Second option", 
        "C": "Third option",
        "D": "Fourth option"
      },
      "correct_answer": "A",
      "explanation": "Detailed explanation of why this answer is correct and others are wrong"
    }
  ]
}

Topic: ${request.topic}
Difficulty: ${request.difficulty}
Number of questions: ${request.questionCount}

CRITICAL: Return ONLY the raw JSON object. Do NOT wrap it in markdown code blocks or backticks. Do NOT include any text before or after the JSON.`;
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!geminiService) {
    geminiService = new GeminiService();
  }
  return geminiService;
};