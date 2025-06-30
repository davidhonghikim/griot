import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { 
  chatStateAtom, 
  addMessageAtom,
  servicesStateAtom
} from '../modules/state/atoms';
import { Button, Input } from '../components/ui';
import { Send, User, Bot, MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';

export const SidePanel: React.FC = () => {
  const [chatState] = useAtom(chatStateAtom);
  const [servicesState] = useAtom(servicesStateAtom);
  const [, addMessage] = useAtom(addMessageAtom);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [parameters] = useState({
    temperature: 0.7,
    maxTokens: 1024,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Get available chat services
  const chatServices = servicesState.services.filter(service => 
    service.type === 'ollama' || service.type === 'openai'
  );

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping || !selectedService) return;

    const userMessage = {
      id: crypto.randomUUID(),
      conversationId: chatState.currentConversation.id,
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date(),
      modelId: selectedService,
      personaId: chatState.currentConversation.personaId,
      metadata: { parameters },
    };

    addMessage(userMessage);
    setInputValue('');
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await fetch('http://localhost:30436/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          serviceId: selectedService,
          parameters,
          personaId: chatState.currentConversation.personaId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          id: crypto.randomUUID(),
          conversationId: chatState.currentConversation.id,
          role: 'assistant' as const,
          content: data.response,
          timestamp: new Date(),
          modelId: selectedService,
          personaId: chatState.currentConversation.personaId,
          metadata: { parameters: data.parameters },
        };
        addMessage(aiMessage);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: crypto.randomUUID(),
        conversationId: chatState.currentConversation.id,
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please check your service connection.',
        timestamp: new Date(),
        modelId: selectedService,
        personaId: chatState.currentConversation.personaId,
        metadata: { error: true },
      };
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    chrome.runtime.sendMessage({ action: 'closeSidePanel' });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-background-primary border border-border-primary rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-3 border-b border-border-primary">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-text-primary" />
            <span className="text-sm font-medium text-text-primary">Quick Chat</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
              className="text-text-secondary hover:text-text-primary"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="p-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a quick message..."
            className="mb-2"
          />
          <div className="flex space-x-2">
            <select 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
              className="flex-1 px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary text-sm"
            >
              <option value="">Service</option>
              {chatServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping || !selectedService}
              size="sm"
              className="bg-interactive-primary hover:bg-interactive-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-background-primary border border-border-primary rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border-primary">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-text-primary" />
          <span className="text-sm font-medium text-text-primary">Quick Chat</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="text-text-secondary hover:text-text-primary"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Service Selection */}
      <div className="p-3 border-b border-border-primary">
        <select 
          value={selectedService} 
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary text-sm"
        >
          <option value="">Select a service</option>
          {chatServices.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chatState.messages.slice(-5).map((message) => (
          <div
            key={message.id}
            className={`flex space-x-2 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                message.role === 'user'
                  ? 'bg-interactive-primary text-white'
                  : 'bg-background-secondary border border-border-primary'
              }`}
            >
              <div className="flex items-center space-x-1 mb-1">
                {message.role === 'user' ? (
                  <User className="w-3 h-3" />
                ) : (
                  <Bot className="w-3 h-3" />
                )}
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="text-xs whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-background-secondary border border-border-primary rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-3 h-3 text-text-secondary" />
                <span className="text-xs text-text-secondary">Thinking...</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-text-secondary rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border-primary">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedService ? "Quick message..." : "Select service first..."}
            className="flex-1 text-sm"
            disabled={isTyping || !selectedService}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || !selectedService}
            size="sm"
            className="bg-interactive-primary hover:bg-interactive-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}; 