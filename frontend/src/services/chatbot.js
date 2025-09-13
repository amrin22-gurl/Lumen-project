import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyBviM_wdZOp1EaEv1FkEDrtRKpeNHSpVfI';
const genAI = new GoogleGenerativeAI(API_KEY);

// Chatbot boundaries and context
const CHATBOT_CONTEXT = `
You are a helpful customer service assistant for a Telecom Subscription Management System. 
Your role is to help users with:

ALLOWED TOPICS:
- Telecom plans and pricing information
- Subscription management (upgrades, downgrades, cancellations)
- Billing and payment questions
- Technical support for telecom services
- Account management
- Service availability and coverage
- Data usage and limits
- Plan features and benefits
- Troubleshooting connectivity issues

BOUNDARIES - DO NOT DISCUSS:
- Personal information beyond what's needed for telecom services
- Financial advice unrelated to telecom services
- Medical or health topics
- Political opinions or controversial topics
- Other companies' services or products
- Technical details about competitors
- Inappropriate or offensive content

RESPONSE GUIDELINES:
- Keep responses concise and helpful
- Always stay professional and friendly
- If asked about topics outside your scope, politely redirect to telecom-related topics
- Provide accurate information about telecom services
- Suggest contacting human support for complex account-specific issues

Available Plans:
- Basic Plan: $29.99/month - Entry-level internet with 24/7 support
- Premium Plan: $59.99/month - High-speed internet with unlimited data and router included

Remember: You are specifically for telecom subscription management assistance only.
`;

class ChatbotService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.chatHistory = [];
  }

  async sendMessage(userMessage) {
    try {
      // Add context and boundaries to the conversation
      const contextualMessage = `${CHATBOT_CONTEXT}\n\nUser: ${userMessage}`;
      
      // Start a new chat session with history
      const chat = this.model.startChat({
        history: this.chatHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(contextualMessage);
      const response = await result.response;
      const botReply = response.text();

      // Update chat history
      this.chatHistory.push(
        { role: 'user', parts: [{ text: userMessage }] },
        { role: 'model', parts: [{ text: botReply }] }
      );

      // Keep history manageable (last 10 exchanges)
      if (this.chatHistory.length > 20) {
        this.chatHistory = this.chatHistory.slice(-20);
      }

      return {
        success: true,
        message: botReply,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Chatbot error:', error);
      return {
        success: false,
        message: 'I apologize, but I\'m having trouble responding right now. Please try again or contact our support team for assistance.',
        timestamp: new Date().toISOString()
      };
    }
  }

  clearHistory() {
    this.chatHistory = [];
  }

  // Predefined quick responses for common questions
  getQuickResponses() {
    return [
      'What plans do you offer?',
      'How can I upgrade my plan?',
      'What is your cancellation policy?',
      'How do I check my data usage?',
      'What payment methods do you accept?'
    ];
  }
}

export default new ChatbotService();