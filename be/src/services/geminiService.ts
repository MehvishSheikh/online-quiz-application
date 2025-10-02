import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIQuizResponseSchema, AIQuizRequest, AIQuizResponse } from '../schemas/aiQuizSchema';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
  }

  /**
   * Generate quiz questions using Gemini AI
   */
  async generateQuizQuestions(request: AIQuizRequest): Promise<AIQuizResponse> {
    const prompt = this.buildPrompt(request);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', text);
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

Generate ONLY valid JSON without any additional text or markdown formatting.`;
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
