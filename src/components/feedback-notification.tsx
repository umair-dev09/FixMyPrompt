'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, X, MessageCircle } from 'lucide-react';

interface FeedbackNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  onOpenFeedback: () => void;
  sessionData: {
    promptsRefined: number;
    timeSpent: number;
  };
}

export function FeedbackNotification({ 
  isVisible, 
  onDismiss, 
  onOpenFeedback, 
  sessionData 
}: FeedbackNotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      
      // Auto-hide after 10 seconds
      const autoHideTimer = setTimeout(() => {
        handleDismiss();
      }, 10000);
      
      return () => clearTimeout(autoHideTimer);
    }
  }, [isVisible]);

  if (!isVisible && !isAnimating) return null;

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(onDismiss, 300); // Wait for animation to complete
  };

  return (
    <div className={`fixed bottom-4 right-4 z-40 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <Card className="w-80 p-4 bg-background/95 backdrop-blur-sm border shadow-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] flex items-center justify-center text-white">
            <MessageCircle className="w-4 h-4" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-sm text-foreground mb-1">
              Quick Feedback?
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              You've refined {sessionData.promptsRefined} prompts in {sessionData.timeSpent}m. 
              Mind sharing your experience?
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={onOpenFeedback}
                className="h-7 px-3 text-xs bg-gradient-to-r from-[hsl(var(--ag-from))] to-[hsl(var(--ag-to))] hover:brightness-110"
              >
                <Star className="w-3 h-3 mr-1" />
                Sure!
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="p-1 h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
