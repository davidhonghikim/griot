/// <reference path="../types/chrome.d.ts" />
/// <reference path="../types/chrome.d.ts" />
import React, { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { 
  chatStateAtom, 
  addMessageAtom,
  servicesStateAtom
} from '../../modules/state/atoms';
import { Button, Input } from '../ui';
import { Send, User, Bot, Settings, MessageSquare, Sliders } from 'lucide-react';

export const ChatTab: React.FC = () => {
  const [chatState] = useAtom(chatStateAtom);
  const [servicesState] = useAtom(servicesStateAtom);
  const [, addMessage] = useAtom(addMessageAtom);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [showParameters, setShowParameters] = useState(false);
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
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

  const ParameterSlider: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
  }> = ({ label, value, min, max, step, onChange }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">{label}</span>
        <span className="text-text-primary">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-background-tertiary rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-background-primary">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-primary bg-background-secondary">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-text-primary" />
          <span className="font-medium text-text-primary">Chat Interface</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowParameters(!showParameters)}
            className="text-text-secondary hover:text-text-primary"
          >
            <Sliders className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Service and Model Selection */}
      <div className="p-4 border-b border-border-primary bg-background-secondary">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Service</label>
            <select 
              value={selectedService} 
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary text-sm"
            >
              <option value="">Select a service</option>
              {chatServices.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.status})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Persona</label>
            <select 
              value={chatState.currentConversation.personaId} 
              onChange={() => {}}
              className="w-full px-3 py-2 bg-background-primary border border-border-primary rounded-md text-text-primary text-sm"
            >
              {chatState.personas.map(persona => (
                <option key={persona.id} value={persona.id}>
                  {persona.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Parameters Panel */}
        {showParameters && (
          <div className="mt-4 p-4 bg-background-primary rounded-lg border border-border-primary">
            <h3 className="text-sm font-medium text-text-primary mb-3">Generation Parameters</h3>
            <div className="grid grid-cols-2 gap-4">
              <ParameterSlider
                label="Temperature"
                value={parameters.temperature}
                min={0}
                max={2}
                step={0.1}
                onChange={(value) => setParameters(prev => ({ ...prev, temperature: value }))}
              />
              <ParameterSlider
                label="Max Tokens"
                value={parameters.maxTokens}
                min={1}
                max={8192}
                step={1}
                onChange={(value) => setParameters(prev => ({ ...prev, maxTokens: value }))}
              />
              <ParameterSlider
                label="Top P"
                value={parameters.topP}
                min={0}
                max={1}
                step={0.1}
                onChange={(value) => setParameters(prev => ({ ...prev, topP: value }))}
              />
              <ParameterSlider
                label="Frequency Penalty"
                value={parameters.frequencyPenalty}
                min={-2}
                max={2}
                step={0.1}
                onChange={(value) => setParameters(prev => ({ ...prev, frequencyPenalty: value }))}
              />
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Welcome to OWU+ Bridge</p>
            <p className="text-sm">Select a service and start chatting!</p>
          </div>
        ) : (
          chatState.messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-interactive-primary text-white'
                    : 'bg-background-secondary border border-border-primary'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.metadata?.error && (
                    <span className="text-xs text-red-400">Error</span>
                  )}
                </div>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-background-secondary border border-border-primary rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-text-secondary" />
                <span className="text-sm text-text-secondary">Thinking...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border-primary bg-background-secondary">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={selectedService ? "Type your message..." : "Select a service first..."}
            className="flex-1"
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