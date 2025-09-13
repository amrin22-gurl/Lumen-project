// Simple test utility to check if chatbot service is working
import chatbotService from '../services/chatbot';

export const testChatbot = async () => {
  try {
    console.log('Testing chatbot service...');
    const response = await chatbotService.sendMessage('Hello, what plans do you offer?');
    console.log('Chatbot test response:', response);
    return response.success;
  } catch (error) {
    console.error('Chatbot test failed:', error);
    return false;
  }
};

// Run test in development mode
if (process.env.NODE_ENV === 'development') {
  // Uncomment the line below to test chatbot on app load
  // testChatbot();
}