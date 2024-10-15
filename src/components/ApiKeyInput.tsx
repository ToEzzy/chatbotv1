import React, { useState } from 'react';
import { Key } from 'lucide-react';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex items-center">
      <div className="relative">
        <input
          type={isVisible ? "text" : "password"}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter OpenAI API Key"
          className="p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          <Key className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ApiKeyInput;