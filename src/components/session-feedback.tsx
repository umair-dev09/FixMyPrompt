'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, X } from 'lucide-react';

interface SessionFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    promptsRefined: number;
    timeSpent: number; // in minutes
    mostUsedFeatures: string[];
  };
  onFeedbackSubmit: (feedback: {
    overallRating: number;
    savedTime: boolean | null;
    wouldRecommend: boolean | null;
    featuresWanted: string[];
    experience: string;
    improvements: string;
  }) => void;
}

const featureOptions = [
  '📝 Prompt Templates',
  '💾 Save History',
  '👥 Team Collaboration',
  '🤖 More AI Models',
  '🎨 Custom Styles',
  '📊 Analytics Dashboard',
  '🔗 API Access',
  '📱 Mobile App',
  '🌐 Browser Extension',
  '📚 Prompt Library',
];

export function SessionFeedback({ isOpen, onClose, sessionData, onFeedbackSubmit }: SessionFeedbackProps) {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [savedTime, setSavedTime] = useState<boolean | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [improvements, setImprovements] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async () => {
    const feedbackData = {
      overallRating,
      savedTime,
      wouldRecommend,
      featuresWanted: selectedFeatures,
      experience: experience.trim(),
      improvements: improvements.trim(),
    };

    onFeedbackSubmit(feedbackData);

    // Store in localStorage for backup
    const existingFeedback = JSON.parse(localStorage.getItem('fixmyprompt_session_feedback') || '[]');
    existingFeedback.push({
      ...feedbackData,
      sessionData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('fixmyprompt_session_feedback', JSON.stringify(existingFeedback));

    // Send to Google Sheets
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'session_feedback',
          data: {
            ...feedbackData,
            sessionData,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
          }
        })
      });
    } catch (error) {
      console.log('Failed to send to Google Sheets, stored locally');
    }

    onClose();
  };

  const canProceedToStep2 = overallRating > 0;
  const canSubmit = overallRating > 0 && savedTime !== null && wouldRecommend !== null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center space-x-2">
              <span>🎉 How was your session?</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Session Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 text-sm border border-blue-200/50 dark:border-blue-800/50">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <div className="font-bold text-lg text-blue-900 dark:text-blue-100">{sessionData.promptsRefined}</div>
                <div className="text-blue-700 dark:text-blue-300">Prompts refined</div>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-lg text-purple-900 dark:text-purple-100">{sessionData.timeSpent}m</div>
                <div className="text-purple-700 dark:text-purple-300">Time spent</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">Overall Experience</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setOverallRating(rating)}
                      className={`w-10 h-10 transition-all duration-200 hover:scale-110 ${
                        rating <= overallRating 
                          ? 'text-yellow-400 dark:text-yellow-300 drop-shadow-sm scale-105' 
                          : 'text-muted-foreground hover:text-yellow-400 dark:hover:text-yellow-300'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-medium text-foreground">
                    {overallRating > 0 && (
                      overallRating === 5 ? 'Excellent! 🌟' :
                      overallRating === 4 ? 'Great! 🎉' :
                      overallRating === 3 ? 'Good 👍' :
                      overallRating === 2 ? 'Okay 😐' : 'Poor 😞'
                    )}
                  </span>
                </div>
              </div>

              {/* Quick Questions */}
              <div className="space-y-5">
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Did we save you time?</label>
                  <div className="flex space-x-3">
                    <Button
                      variant={savedTime === true ? 'default' : 'outline'}
                      onClick={() => setSavedTime(true)}
                      size="sm"
                      className={`transition-all duration-200 ${
                        savedTime === true 
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm' 
                          : 'hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                    >
                      Yes ✅
                    </Button>
                    <Button
                      variant={savedTime === false ? 'destructive' : 'outline'}
                      onClick={() => setSavedTime(false)}
                      size="sm"
                      className={`transition-all duration-200 ${
                        savedTime === false 
                          ? 'shadow-sm' 
                          : 'hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      No ❌
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium">Would you recommend FixMyPrompt?</label>
                  <div className="flex space-x-3">
                    <Button
                      variant={wouldRecommend === true ? 'default' : 'outline'}
                      onClick={() => setWouldRecommend(true)}
                      size="sm"
                      className={`transition-all duration-200 ${
                        wouldRecommend === true 
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm' 
                          : 'hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-600 dark:hover:text-green-400'
                      }`}
                    >
                      Yes 👍
                    </Button>
                    <Button
                      variant={wouldRecommend === false ? 'destructive' : 'outline'}
                      onClick={() => setWouldRecommend(false)}
                      size="sm"
                      className={`transition-all duration-200 ${
                        wouldRecommend === false 
                          ? 'shadow-sm' 
                          : 'hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      No 👎
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 hover:bg-muted dark:hover:bg-muted/40"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-300">
              {/* Feature Requests */}
              <div className="space-y-3">
                <label className="block text-sm font-medium">What features would you like to see?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {featureOptions.map((feature) => (
                    <Badge
                      key={feature}
                      variant={selectedFeatures.includes(feature) ? 'default' : 'outline'}
                      className="cursor-pointer text-xs p-3 justify-center hover:bg-muted dark:hover:bg-muted/40 transition-all duration-200 hover:shadow-sm"
                      onClick={() => handleFeatureToggle(feature)}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Describe your experience (optional)</label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="What did you like most? What was confusing?"
                  className="w-full p-3 text-sm border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/50 text-foreground transition-all duration-200"
                  rows={3}
                />
              </div>

              {/* Improvements */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">How can we improve? (optional)</label>
                <textarea
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="What could make FixMyPrompt better for you?"
                  className="w-full p-3 text-sm border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background/50 text-foreground transition-all duration-200"
                  rows={3}
                />
              </div>

              {/* Navigation */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 hover:bg-muted dark:hover:bg-muted/40"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
