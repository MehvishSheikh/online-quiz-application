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
          maxOutputTokens: 26384, // Increased from 8192
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
      
      // Check if response looks incomplete (common signs)
      if (!cleanedText.endsWith('}') && !cleanedText.endsWith(']')) {
        console.error('AI response appears truncated:', cleanedText.slice(-200));
        throw new Error('AI response was truncated - try requesting fewer questions');
      }
      
      // Parse the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON. Last 500 chars:', cleanedText.slice(-500));
        throw new Error('Invalid JSON response from AI - response may be truncated');
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
4. Keep explanations brief and concise (2-3 sentences maximum)
5. Make questions practical and relevant to real-world scenarios
6. Avoid trick questions or overly ambiguous wording
7. Keep question text and options short and clear

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
      "explanation": "Brief explanation (2-3 sentences)"
    }
  ]
}

Topic: ${request.topic}
Difficulty: ${request.difficulty}
Number of questions: ${request.questionCount}

CRITICAL INSTRUCTIONS:
- Return ONLY valid JSON
- Do NOT wrap in markdown code blocks
- Keep ALL text concise to avoid truncation
- Ensure the JSON is complete and properly closed
- Limit explanation length to prevent response cutoff`;
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