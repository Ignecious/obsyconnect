import { Injectable } from '@angular/core';
import { TIXXETS_KNOWLEDGE_BASE } from '../data/knowledge-bases/tixxets-kb';

export interface AIResponse {
  text: string;
  confidence: number;  // 0-100
  reasoning?: string;  // Why this confidence level
}

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiKey = 'YOUR_OPENAI_API_KEY';  // TODO: Replace with your OpenAI API key
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private knowledgeBase = TIXXETS_KNOWLEDGE_BASE;

  constructor() {}

  async getResponse(
    customerMessage: string,
    conversationHistory: any[] = []
  ): Promise<AIResponse> {
    // Check if API key is set
    if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY') {
      return {
        text: 'AI is not configured yet. Please add your OpenAI API key in the AI service.',
        confidence: 0,
        reasoning: 'No API key configured'
      };
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a helpful customer support assistant for Tixxets.

${this.knowledgeBase}

RESPONSE RULES:
1. Only use information from the knowledge base above
2. If the answer is not in the knowledge base, respond EXACTLY with: "That's a great question! Let me connect you with a team member who can help with that specific request."
3. Be warm, friendly, and professional
4. Keep responses under 80 words
5. Use bullet points for lists
6. If customer seems frustrated, acknowledge their feelings first

NEVER:
- Make up information not in the knowledge base
- Promise things you're unsure about
- Give legal or financial advice
- Share personal opinions`
            },
            ...conversationHistory.slice(-5).map(msg => ({
              role: msg.sender === 'customer' ? 'user' : 'assistant',
              content: msg.message
            })),
            {
              role: 'user',
              content: customerMessage
            }
          ],
          temperature: 0.3,  // Low = more consistent, less creative
          max_tokens: 200,
          presence_penalty: 0.0,
          frequency_penalty: 0.0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0].message.content.trim();

      // Calculate confidence
      const confidence = this.calculateConfidence(aiMessage, customerMessage);

      return {
        text: aiMessage,
        confidence: confidence,
        reasoning: this.getConfidenceReasoning(aiMessage, confidence)
      };

    } catch (error) {
      console.error('AI Service Error:', error);

      // Fallback to safe response
      return {
        text: "I'm having trouble right now. Let me connect you with a team member who can help.",
        confidence: 0,
        reasoning: `API error: ${error}`
      };
    }
  }

  private calculateConfidence(aiResponse: string, customerMessage: string): number {
    // If AI explicitly escalates to human
    if (aiResponse.toLowerCase().includes('connect you with a team member') ||
        aiResponse.toLowerCase().includes('let me connect you')) {
      return 20;
    }

    // Very short responses might be uncertain
    if (aiResponse.length < 30) {
      return 50;
    }

    // If response contains specific numbers/policies, likely accurate
    if (aiResponse.match(/\d+\s*(hours|days|minutes|%|R)/i)) {
      return 95;
    }

    // If response is detailed (>100 chars), likely confident
    if (aiResponse.length > 100) {
      return 90;
    }

    // Default medium confidence
    return 75;
  }

  private getConfidenceReasoning(aiResponse: string, confidence: number): string {
    if (confidence < 30) {
      return 'AI escalated to human agent - question outside knowledge base';
    }
    if (confidence < 70) {
      return 'Uncertain response - suggest agent review';
    }
    return 'High confidence - answer found in knowledge base';
  }

  // Test method to verify AI is working
  async testAI(): Promise<{ success: boolean; message: string }> {
    try {
      const testResponse = await this.getResponse(
        'What is your refund policy?',
        []
      );

      if (testResponse.confidence > 70) {
        return {
          success: true,
          message: `AI working! Response: "${testResponse.text.substring(0, 50)}..."`
        };
      } else {
        return {
          success: false,
          message: 'AI responding but with low confidence'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `AI test failed: ${error}`
      };
    }
  }
}
