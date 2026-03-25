import { Card } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-700" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#0A4D3C] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <Card
          className={`p-4 inline-block max-w-xs lg:max-w-md ${
            isUser
              ? 'bg-[#0A4D3C] text-white rounded-bl-lg rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none rounded-br-lg'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </Card>
        {timestamp && (
          <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
