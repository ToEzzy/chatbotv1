import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import ApiKeyInput from './components/ApiKeyInput';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { text: message, isUser: true }]);
    
    if (!apiKey) {
      setMessages(prev => [...prev, { text: "Please enter your OpenAI API key first.", isUser: false }]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const botResponse = response.data.choices[0].message.content;
      setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
    } catch (error) {
      console.error('Error calling OpenAI API:', JSON.stringify(error, null, 2));
      let errorMessage = "Sorry, there was an error processing your request.";
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          errorMessage = "You've exceeded the rate limit. Please wait a moment before trying again.";
        } else if (error.response?.status === 401) {
          errorMessage = "Invalid API key. Please check your API key and try again.";
        } else if (error.response?.data?.error?.message) {
          errorMessage = error.response.data.error.message;
        }
      }
      
      setMessages(prev => [...prev, { text: errorMessage, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-500 mr-2" />
            <h1 className="text-xl font-bold text-gray-800">Novabot UI</h1>
          </div>
          <ApiKeyInput apiKey={apiKey} setApiKey={setApiKey} />
        </div>
      </header>
      <main className="flex-grow overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <ChatWindow messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;