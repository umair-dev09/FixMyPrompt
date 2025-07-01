'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, MessageCircle, CheckCircle } from 'lucide-react';

interface QuickFeedbackProps {
  promptId: string;
  promptText: string;
  onFeedbackSubmit: (feedback: {
    promptId: string;
    rating: number;
    sentiment: 'positive' | 'negative' | null;
    quickFeedback: string[];
    detailedFeedback?: string;
  }) => void;
}

const quickFeedbackOptions = [
  { id: 'clear', label: '🎯 Clear & Focused', category: 'positive' },
  { id: 'helpful', label: '✨ Very Helpful', category: 'positive' },
  { id: 'creative', label: '🎨 More Creative', category: 'positive' },
  { id: 'professional', label: '💼 Professional', category: 'positive' },
  { id: 'needs-work', label: '🔄 Needs Refinement', category: 'negative' },
  { id: 'unclear', label: '❓ Unclear', category: 'negative' },
  { id: 'too-long', label: '📏 Too Long', category: 'negative' },
  { id: 'not-relevant', label: '❌ Not Relevant', category: 'negative' },
];

export function QuickFeedback({ promptId, promptText, onFeedbackSubmit }: QuickFeedbackProps) {
  const [rating, setRating] = useState<number>(0);
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleQuickFeedbackToggle = (optionId: string) => {
    setSelectedFeedback(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async () => {
    const feedbackData = {
      promptId,
      rating,
      sentiment,
      quickFeedback: selectedFeedback,
      detailedFeedback: detailedFeedback.trim() || undefined,
    };

    onFeedbackSubmit(feedbackData);
    setIsSubmitted(true);

    // Store in localStorage for backup
    const existingFeedback = JSON.parse(localStorage.getItem('fixmyprompt_feedback') || '[]');
    existingFeedback.push({
      ...feedbackData,
      timestamp: new Date().toISOString(),
      promptText: promptText.substring(0, 200) + '...',
    });
    localStorage.setItem('fixmyprompt_feedback', JSON.stringify(existingFeedback));

    // Send to Google Sheets
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'prompt_feedback',
          data: {
            ...feedbackData,
            timestamp: new Date().toISOString(),
            promptText: promptText.substring(0, 200) + '...',
            userAgent: navigator.userAgent,
            url: window.location.href,
          }
        })
      });
    } catch (error) {
      console.log('Failed to send to Google Sheets, stored locally');
    }

    // Auto-collapse after 2 seconds
    setTimeout(() => {
      setIsExpanded(false);
    }, 2000);
  };

  if (isSubmitted && !isExpanded) {
    return (
      <div className="mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="w-full text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/20 text-sm py-2 px-3 border border-green-200 dark:border-green-800 rounded-lg transition-all duration-200"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          ✅ Thanks for your feedback! (Click to edit)
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-3">
      {/* Collapsed State */}
      {!isExpanded ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground hover:bg-muted/50 dark:hover:bg-muted/30 text-sm py-3 px-4 border border-border/40 rounded-lg transition-all duration-200 hover:shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>How was this refinement?</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      ) : (
        /* Expanded State */
        <Card className="border border-border/60 dark:border-border/40 bg-card/50 dark:bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-foreground">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Quick feedback</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-6 h-6 transition-all duration-200 transform hover:scale-110 ${
                      star <= rating 
                        ? 'text-yellow-400 dark:text-yellow-300 drop-shadow-sm' 
                        : 'text-muted-foreground hover:text-yellow-400 dark:hover:text-yellow-300'
                    }`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={sentiment === 'positive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSentiment(sentiment === 'positive' ? null : 'positive')}
                  className={`h-8 w-8 p-0 transition-all duration-200 ${
                    sentiment === 'positive' 
                      ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm' 
                      : 'hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button
                  variant={sentiment === 'negative' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setSentiment(sentiment === 'negative' ? null : 'negative')}
                  className={`h-8 w-8 p-0 transition-all duration-200 ${
                    sentiment === 'negative' 
                      ? 'shadow-sm' 
                      : 'hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Feedback Options */}
            <div className="flex flex-wrap gap-2">
              {quickFeedbackOptions.map((option) => (
                <Badge
                  key={option.id}
                  variant={selectedFeedback.includes(option.id) ? 'default' : 'secondary'}
                  className={`cursor-pointer text-xs px-3 py-1.5 transition-all duration-200 hover:scale-105 ${
                    selectedFeedback.includes(option.id)
                      ? option.category === 'positive'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700 shadow-sm'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700 shadow-sm'
                      : 'hover:bg-muted dark:hover:bg-muted/60 hover:shadow-sm'
                  }`}
                  onClick={() => handleQuickFeedbackToggle(option.id)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>

            {/* Optional Detailed Feedback */}
            {(rating > 0 || selectedFeedback.length > 0) && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <Textarea
                  value={detailedFeedback}
                  onChange={(e) => setDetailedFeedback(e.target.value)}
                  placeholder="Any specific thoughts? (optional)"
                  className="text-sm resize-none bg-background/50 dark:bg-background/50 border-border dark:border-border focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  rows={2}
                />
                <Button
                  onClick={handleSubmit}
                  size="sm"
                  disabled={rating === 0 && selectedFeedback.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  Submit Feedback
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
