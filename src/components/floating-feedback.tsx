'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Bug, Lightbulb, HelpCircle, Heart } from 'lucide-react';

interface FloatingFeedbackProps {
  onFeedbackSubmit: (feedback: {
    type: 'bug' | 'feature' | 'question' | 'general';
    message: string;
    email?: string;
  }) => void;
}

const feedbackTypes = [
  { id: 'bug', label: '🐛 Report Bug', icon: Bug, color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-800' },
  { id: 'feature', label: '💡 Feature Request', icon: Lightbulb, color: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-300 dark:border-yellow-800' },
  { id: 'question', label: '❓ Ask Question', icon: HelpCircle, color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-800' },
  { id: 'general', label: '💭 General Feedback', icon: Heart, color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-800' },
];

export function FloatingFeedback({ onFeedbackSubmit }: FloatingFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<'bug' | 'feature' | 'question' | 'general' | null>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!selectedType || !message.trim()) return;

    const feedbackData = {
      type: selectedType,
      message: message.trim(),
      email: email.trim() || undefined,
    };

    onFeedbackSubmit(feedbackData);

    // Store in localStorage for backup
    const existingFeedback = JSON.parse(localStorage.getItem('fixmyprompt_general_feedback') || '[]');
    existingFeedback.push({
      ...feedbackData,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
    localStorage.setItem('fixmyprompt_general_feedback', JSON.stringify(existingFeedback));

    // Send to Google Sheets
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general_feedback',
          data: {
            ...feedbackData,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          }
        })
      });
    } catch (error) {
      console.log('Failed to send to Google Sheets, stored locally');
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsSubmitted(false);
      setSelectedType(null);
      setMessage('');
      setEmail('');
    }, 2000);
  };

  const getPlaceholder = () => {
    switch (selectedType) {
      case 'bug':
        return 'Describe the bug: What happened? What were you trying to do? What did you expect to happen?';
      case 'feature':
        return 'Describe the feature: What would you like to see? How would it help you?';
      case 'question':
        return 'Ask your question: What would you like to know about FixMyPrompt?';
      case 'general':
        return 'Share your thoughts: What do you think about FixMyPrompt? Any suggestions?';
      default:
        return 'Tell us what\'s on your mind...';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Feedback Button */}
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
            isOpen ? 'rotate-180' : ''
          }`}
          size="sm"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </Button>

        {/* Feedback Panel */}
        {isOpen && (
          <Card className="absolute bottom-16 right-0 w-80 sm:w-96 shadow-2xl border border-border bg-card/95 dark:bg-card/95 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2 text-foreground">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Share Your Feedback</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {isSubmitted ? (
                <div className="text-center py-6 animate-in fade-in-0 duration-500">
                  <div className="text-green-600 dark:text-green-400 text-2xl mb-3">✅</div>
                  <p className="text-green-700 dark:text-green-300 font-medium text-lg">Thank you for your feedback!</p>
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">We'll review it and get back to you if needed.</p>
                </div>
              ) : (
                <>
                  {/* Feedback Type Selection */}
                  {!selectedType ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">What would you like to share?</p>
                      <div className="grid grid-cols-1 gap-3">
                        {feedbackTypes.map((type) => (
                          <Button
                            key={type.id}
                            variant="outline"
                            onClick={() => setSelectedType(type.id as any)}
                            className="justify-start p-4 h-auto hover:bg-muted dark:hover:bg-muted/40 text-foreground border-border transition-all duration-200 hover:shadow-sm"
                          >
                            <type.icon className="w-5 h-5 mr-3 text-muted-foreground" />
                            <div className="text-left">
                              <div className="font-medium">{type.label}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-left-2 duration-300">
                      {/* Selected Type */}
                      <div className="flex items-center justify-between">
                        <Badge className={`${feedbackTypes.find(t => t.id === selectedType)?.color} px-3 py-1`}>
                          {feedbackTypes.find(t => t.id === selectedType)?.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedType(null)}
                          className="text-muted-foreground hover:text-foreground h-8 px-2"
                        >
                          Change
                        </Button>
                      </div>

                      {/* Message Input */}
                      <div className="space-y-2">
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={getPlaceholder()}
                          className="text-sm resize-none bg-background/50 dark:bg-background/50 border-border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                          rows={4}
                        />
                      </div>

                      {/* Optional Email */}
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground font-medium">
                          Email (optional - for follow-up)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedType(null)}
                          className="flex-1 hover:bg-muted dark:hover:bg-muted/40"
                          size="sm"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={!message.trim()}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                          size="sm"
                        >
                          Send Feedback
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
