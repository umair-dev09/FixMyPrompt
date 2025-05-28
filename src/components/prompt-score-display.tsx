'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { scorePrompt, getPromptFeedback, type PromptScore } from '@/utils/prompt-scoring';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PromptScoreDisplayProps {
  promptText: string;
  className?: string;
}

export function PromptScoreDisplay({ promptText, className = '' }: PromptScoreDisplayProps) {
  const [score, setScore] = React.useState<PromptScore | null>(null);
  const [feedback, setFeedback] = React.useState<string>('');
  
  React.useEffect(() => {
    // Only calculate score if there's actual text
    if (promptText && promptText.trim().length > 0) {
      const calculatedScore = scorePrompt(promptText);
      setScore(calculatedScore);
      setFeedback(getPromptFeedback(calculatedScore));
    } else {
      setScore(null);
      setFeedback('');
    }
  }, [promptText]);
  
  if (!score) return null;
  
  // Skip rendering if prompt is too short to be meaningful
  if (promptText.trim().length < 5) return null;
  
  // Custom color based on score value
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Label based on overall score
  const getOverallLabel = (value: number) => {
    if (value >= 90) return 'Excellent';
    if (value >= 80) return 'Very Good';
    if (value >= 70) return 'Good';
    if (value >= 60) return 'Decent';
    if (value >= 40) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className={`mt-1 p-3 rounded-b-lg border-x border-b border-input bg-background/80 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn ${className}`}>
      <div className="flex flex-col gap-2 text-xs">
        {/* Overall score with label and feedback */}
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-sm">Prompt Quality: <span className="font-semibold">{getOverallLabel(score.overall)}</span></span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help hover:text-primary transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="p-3 max-w-[280px]">
                  <p className="text-sm font-medium mb-1">Prompt Quality Score: {score.overall}%</p>
                  <p className="text-xs">{feedback}</p>
                  <p className="text-xs mt-2 text-muted-foreground">Hover over each metric below for more details.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="font-semibold text-sm">{score.overall}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Clarity score */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help flex items-center">
                    Clarity
                    <Info className="ml-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="p-2 max-w-[250px]">
                  <p className="text-xs">Clear prompts use direct language and well-structured content. Avoid vague terms like "maybe" or "kind of".</p>
                </TooltipContent>
              </Tooltip>
              <span>{score.clarity}%</span>
            </div>
            <Progress value={score.clarity} className="h-1.5" indicatorClassName={getScoreColor(score.clarity)} />
          </div>
          
          {/* Length score */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help flex items-center">
                    Length
                    <Info className="ml-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="p-2 max-w-[250px]">
                  <p className="text-xs">Ideal prompts are 40-200 words. Too short lacks detail, too long may confuse the AI.</p>
                </TooltipContent>
              </Tooltip>
              <span>{score.length}%</span>
            </div>
            <Progress value={score.length} className="h-1.5" indicatorClassName={getScoreColor(score.length)} />
          </div>
          
          {/* Specificity score */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help flex items-center">
                    Specificity
                    <Info className="ml-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="p-2 max-w-[250px]">
                  <p className="text-xs">Specific prompts include details, examples, and clear parameters. Include numbers, dates, or measurements where relevant.</p>
                </TooltipContent>
              </Tooltip>
              <span>{score.specificity}%</span>
            </div>
            <Progress value={score.specificity} className="h-1.5" indicatorClassName={getScoreColor(score.specificity)} />
          </div>
          
          {/* Actionability score */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help flex items-center">
                    Actionability
                    <Info className="ml-0.5 h-3.5 w-3.5 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="p-2 max-w-[250px]">
                  <p className="text-xs">Actionable prompts start with clear verbs like "create", "explain", or "analyze" and clearly state the desired outcome.</p>
                </TooltipContent>
              </Tooltip>
              <span>{score.actionability}%</span>
            </div>
            <Progress value={score.actionability} className="h-1.5" indicatorClassName={getScoreColor(score.actionability)} />
          </div>
        </div>

        <div className="col-span-2 text-center mt-1">
          <p className="text-xs text-muted-foreground italic">Hover over metrics for improvement tips</p>
        </div>
      </div>
    </div>
  );
}
