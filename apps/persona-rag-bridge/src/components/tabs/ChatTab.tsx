import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { 
  chatStateAtom, 
  addMessageAtom,
  recentMessagesAtom 
} from '../../modules/state/atoms';
import { Button, Input } from '../ui';
import { Message, Send, User, Bot, Settings } from 'lucide-react';

export const ChatTab: React.FC = () => {
  const [chatState] = useAtom(chatStateAtom);
  const [recentMessages] = useAtom(recentMessagesAtom);
  const [, addMessage] = useAtom(addMessageAtom);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: crypto.randomUUID(),
      conversationId: chatState.currentConversation.id,
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date(),
      modelId: chatState.currentConversation.modelId,
      personaId: chatState.currentConversation.personaId,
      metadata: {},
    };

    addMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: crypto.randomUUID(),
        conversationId: chatState.currentConversation.id,
        role: 'assistant' as const,
        content: `This is a simulated response to: "${inputValue}"`,
        timestamp: new Date(),
        modelId: chatState.currentConversation.modelId,
        personaId: chatState.currentConversation.personaId,
        metadata: {},
      };
      addMessage(aiMessage);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Message className="w-4 h-4" />
          <span className="font-medium">Chat</span>
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Persona Selector */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Persona:</span>
          <select 
            className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background"
            value={chatState.currentConversation.personaId}
            onChange={(e) => {
              // Update persona
            }}
          >
            <option value="">Select Persona</option>
            {chatState.personas.map(persona => (
              <option key={persona.id} value={persona.id}>
                {persona.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {recentMessages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Message className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          recentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {message.role === 'user' ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-3 h-3" />
                <span className="text-sm text-muted-foreground">Typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 