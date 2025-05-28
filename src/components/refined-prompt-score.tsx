'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { scorePrompt, getPromptFeedback, type PromptScore } from '@/utils/prompt-scoring';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart2, Info } from 'lucide-react';

interface RefinedPromptScoreProps {
  promptText: string;
  className?: string;
  showDetail?: boolean;
}

export function RefinedPromptScore({ promptText, className = '', showDetail = false }: RefinedPromptScoreProps) {
  const [score, setScore] = React.useState<PromptScore | null>(null);
  
  React.useEffect(() => {
    if (promptText && promptText.trim().length > 0) {
      const calculatedScore = scorePrompt(promptText);
      setScore(calculatedScore);
    } else {
      setScore(null);
    }
  }, [promptText]);
  
  if (!score) return null;
  
  // Get quality label and color based on overall score
  const getQualityInfo = (value: number) => {
    if (value >= 90) return { label: 'Excellent', color: 'bg-green-500/90 text-white', lightColor: 'bg-green-100' };
    if (value >= 80) return { label: 'Very Good', color: 'bg-green-400/90 text-white', lightColor: 'bg-green-100' };
    if (value >= 70) return { label: 'Good', color: 'bg-green-300/90 text-black', lightColor: 'bg-green-100' };
    if (value >= 60) return { label: 'Decent', color: 'bg-yellow-400/90 text-black', lightColor: 'bg-yellow-50' };
    if (value >= 50) return { label: 'Fair', color: 'bg-yellow-500/90 text-black', lightColor: 'bg-yellow-50' };
    return { label: 'Needs Work', color: 'bg-red-400/90 text-white', lightColor: 'bg-red-50' };
  };

  const { label, color, lightColor } = getQualityInfo(score.overall);

  if (!showDetail) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`${color} font-medium cursor-help`}>
              {score.overall}%
            </Badge>
          </TooltipTrigger>
          <TooltipContent align="start" className="p-3 max-w-[250px]">
            <p className="text-sm font-medium">{label} Prompt Quality</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1.5 text-xs">
              <div>Clarity: {score.clarity}%</div>
              <div>Length: {score.length}%</div>
              <div>Specificity: {score.specificity}%</div>
              <div>Actionability: {score.actionability}%</div>
            </div>
          </TooltipContent>
        </Tooltip>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    );
  }
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Badge className={`${color} font-medium shadow-sm`}>
          <BarChart2 className="h-3.5 w-3.5 mr-1" />
          {score.overall}%
        </Badge>
        <span className="text-sm font-medium">{label} Prompt Quality</span>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 p-3 rounded-md bg-card/50 border border-border/20 shadow-sm backdrop-blur-sm transition-all duration-200`}>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium flex items-center gap-0.5 cursor-help">
                  Clarity
                  <Info className="h-3 w-3 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="p-3 max-w-[250px]">
                <p className="font-medium mb-1">Clarity Score: {score.clarity}%</p>
                <p className="text-xs">Clear prompts use direct language and well-structured content. Avoid vague terms like "maybe" or "kind of".</p>
                {score.clarity < 70 && (
                  <p className="text-xs mt-1 text-yellow-500 dark:text-yellow-400">Tip: Be more direct and structured in your requests.</p>
                )}
              </TooltipContent>
            </Tooltip>
            <span>{score.clarity}%</span>
          </div>
          <Progress value={score.clarity} className="h-2" indicatorClassName={`${score.clarity >= 80 ? 'bg-green-500' : score.clarity >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium flex items-center gap-0.5 cursor-help">
                  Length
                  <Info className="h-3 w-3 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="p-3 max-w-[250px]">
                <p className="font-medium mb-1">Length Score: {score.length}%</p>
                <p className="text-xs">Ideal prompts are 40-200 words. Too short lacks detail, too long may confuse the AI.</p>
                {score.length < 70 && (
                  <p className="text-xs mt-1 text-yellow-500 dark:text-yellow-400">Tip: Aim for 40-200 words for optimal results.</p>
                )}
              </TooltipContent>
            </Tooltip>
            <span>{score.length}%</span>
          </div>
          <Progress value={score.length} className="h-2" indicatorClassName={`${score.length >= 80 ? 'bg-green-500' : score.length >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium flex items-center gap-0.5 cursor-help">
                  Specificity
                  <Info className="h-3 w-3 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="p-3 max-w-[250px]">
                <p className="font-medium mb-1">Specificity Score: {score.specificity}%</p>
                <p className="text-xs">Specific prompts include details, examples, and clear parameters. Include numbers, dates, or measurements where relevant.</p>
                {score.specificity < 70 && (
                  <p className="text-xs mt-1 text-yellow-500 dark:text-yellow-400">Tip: Add more concrete details and examples.</p>
                )}
              </TooltipContent>
            </Tooltip>
            <span>{score.specificity}%</span>
          </div>
          <Progress value={score.specificity} className="h-2" indicatorClassName={`${score.specificity >= 80 ? 'bg-green-500' : score.specificity >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-medium flex items-center gap-0.5 cursor-help">
                  Actionability
                  <Info className="h-3 w-3 text-muted-foreground" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start" className="p-3 max-w-[250px]">
                <p className="font-medium mb-1">Actionability Score: {score.actionability}%</p>
                <p className="text-xs">Actionable prompts start with clear action verbs like "create", "explain", or "analyze" and clearly state the desired outcome or goal.</p>
                {score.actionability < 70 && (
                  <p className="text-xs mt-1 text-yellow-500 dark:text-yellow-400">Tip: Start with a clear action verb and state your goal.</p>
                )}
              </TooltipContent>
            </Tooltip>
            <span>{score.actionability}%</span>
          </div>
          <Progress value={score.actionability} className="h-2" indicatorClassName={`${score.actionability >= 80 ? 'bg-green-500' : score.actionability >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
        </div>
      </div>
    </div>
  );
}
