// Prompt scoring utility for FixMyPrompt
// Evaluates prompts based on clarity, length, specificity, and actionability

export interface PromptScore {
  clarity: number;      // 0-100 score for clarity
  length: number;       // 0-100 score for appropriate length
  specificity: number;  // 0-100 score for specificity/detail
  actionability: number; // 0-100 score for actionability
  overall: number;      // 0-100 weighted overall score
}

// Constants for scoring
const MIN_RECOMMENDED_LENGTH = 15;
const OPTIMAL_MIN_LENGTH = 40; 
const OPTIMAL_MAX_LENGTH = 200;
const MAX_RECOMMENDED_LENGTH = 500;

// Keywords that indicate specificity
const SPECIFICITY_KEYWORDS = [
  'specifically', 'exactly', 'precise', 'detailed', 'particular',
  'step-by-step', 'step by step', 'specific', 'details', 'explain',
  'example', 'concrete', 'explicitly', 'clearly'
];

// Keywords that indicate actionability
const ACTIONABILITY_KEYWORDS = [
  'create', 'write', 'generate', 'develop', 'build', 'design', 'make',
  'analyze', 'explain', 'describe', 'summarize', 'compare', 'outline',
  'list', 'provide', 'suggest', 'recommend'
];

// Phrases that reduce clarity
const CLARITY_REDUCING_PHRASES = [
  'i think', 'maybe', 'perhaps', 'possibly', 'kind of', 'sort of',
  'a bit', 'somewhat', 'i guess', 'not sure', 'might be'
];

// Advanced scoring factors
const CONTEXT_INDICATORS = [
  'for a', 'for an', 'targeted at', 'audience', 'context', 'background',
  'purpose is', 'intended for', 'scenario', 'setting', 'environment'
];

const FORMAT_INDICATORS = [
  'bullet points', 'numbered list', 'paragraphs', 'sections', 'table',
  'format', 'structure', 'organize', 'layout', 'outline', 'formatted as'
];

const CONSTRAINT_INDICATORS = [
  'limit', 'maximum', 'minimum', 'at least', 'at most', 'no more than',
  'within', 'between', 'range', 'constraint', 'restriction', 'boundary'
];

/**
 * Analyzes a prompt and returns scores for various qualities
 * @param prompt The prompt text to analyze
 * @returns PromptScore object with scores for clarity, length, specificity, actionability, and overall
 */
export function scorePrompt(prompt: string): PromptScore {
  if (!prompt || prompt.trim().length === 0) {
    return {
      clarity: 0,
      length: 0,
      specificity: 0,
      actionability: 0,
      overall: 0
    };
  }

  const words = prompt.trim().split(/\s+/);
  const wordCount = words.length;
  const promptLowerCase = prompt.toLowerCase();
  
  // Score for length (0-100)
  let lengthScore = 0;
  if (wordCount < MIN_RECOMMENDED_LENGTH) {
    lengthScore = Math.round((wordCount / MIN_RECOMMENDED_LENGTH) * 40); // Max 40 for very short prompts
  } else if (wordCount >= MIN_RECOMMENDED_LENGTH && wordCount < OPTIMAL_MIN_LENGTH) {
    lengthScore = Math.round(40 + ((wordCount - MIN_RECOMMENDED_LENGTH) / (OPTIMAL_MIN_LENGTH - MIN_RECOMMENDED_LENGTH)) * 40); // 40-80
  } else if (wordCount >= OPTIMAL_MIN_LENGTH && wordCount <= OPTIMAL_MAX_LENGTH) {
    lengthScore = 100; // Perfect length
  } else if (wordCount > OPTIMAL_MAX_LENGTH && wordCount <= MAX_RECOMMENDED_LENGTH) {
    lengthScore = Math.round(100 - ((wordCount - OPTIMAL_MAX_LENGTH) / (MAX_RECOMMENDED_LENGTH - OPTIMAL_MAX_LENGTH)) * 20); // 80-100
  } else {
    lengthScore = Math.max(0, Math.round(80 - ((wordCount - MAX_RECOMMENDED_LENGTH) / 100) * 20)); // Decreases for very long prompts
  }

  // Score for specificity (0-100)
  const specificityKeywordsCount = SPECIFICITY_KEYWORDS.filter(keyword => 
    promptLowerCase.includes(keyword.toLowerCase())
  ).length;
  
  // Check for specific formats like dates, numbers, percentages, dimensions
  const hasNumbers = /\d+/.test(prompt);
  const hasDates = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december|[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{2,4})\b/i.test(prompt);
  const hasUnits = /\b\d+\s*(px|em|rem|cm|mm|m|kg|lb|hrs?|hours?|mins?|minutes?|secs?|seconds?)\b/i.test(prompt);
  
  // Check for context, format, and constraints
  const hasContext = CONTEXT_INDICATORS.some(indicator => promptLowerCase.includes(indicator));
  const hasFormat = FORMAT_INDICATORS.some(indicator => promptLowerCase.includes(indicator));
  const hasConstraints = CONSTRAINT_INDICATORS.some(indicator => promptLowerCase.includes(indicator));
  
  const specificFormatsCount = (hasNumbers ? 1 : 0) + (hasDates ? 1 : 0) + (hasUnits ? 1 : 0);
  const advancedFactorsCount = (hasContext ? 1 : 0) + (hasFormat ? 1 : 0) + (hasConstraints ? 1 : 0);
  
  // Calculate specificity score based on keywords, specific formats, and advanced factors
  const specificityScore = Math.min(100, Math.round((specificityKeywordsCount * 12) + 
    (specificFormatsCount * 15) + (advancedFactorsCount * 15) + 
    (wordCount >= OPTIMAL_MIN_LENGTH ? 25 : Math.round((wordCount / OPTIMAL_MIN_LENGTH) * 25))));

  // Score for clarity (0-100)
  const clarityReducingCount = CLARITY_REDUCING_PHRASES.filter(phrase => 
    promptLowerCase.includes(phrase.toLowerCase())
  ).length;
  
  // Check for structural elements that improve clarity
  const hasListMarkers = /(\n\s*[-•*]\s|\d+\.\s)/.test(prompt);
  const hasSections = /\b(first|second|third|finally|lastly|next|then|conclusion|summary|overview|introduction)\b/i.test(prompt);
  const hasQuestions = /\?/.test(prompt);
  const hasSentenceVariety = calculateSentenceVariety(prompt);
  
  const clarityStructureScore = (hasListMarkers ? 15 : 0) + 
    (hasSections ? 15 : 0) + 
    (hasQuestions ? 10 : 0) + 
    (hasSentenceVariety ? 15 : 0);
  
  // Calculate clarity score
  let clarityScore = 65; // Start with a baseline score
  clarityScore += clarityStructureScore;
  clarityScore -= (clarityReducingCount * 15); // Reduce for vague language
  clarityScore = Math.max(0, Math.min(100, clarityScore));

  // Score for actionability (0-100)
  const actionabilityKeywordsCount = ACTIONABILITY_KEYWORDS.filter(keyword => 
    promptLowerCase.includes(keyword.toLowerCase())
  ).length;
  
  // Check if the prompt starts with an action verb
  const startsWithActionVerb = ACTIONABILITY_KEYWORDS.some(verb => 
    new RegExp(`^${verb}\\b`, 'i').test(promptLowerCase)
  );
  
  // Check if prompt has clear goals or outcomes
  const hasGoalIndicators = /\b(goal|outcome|result|achieve|aim|objective|purpose|target)\b/i.test(promptLowerCase);
  
  // Calculate actionability score
  const actionabilityScore = Math.min(100, Math.round((actionabilityKeywordsCount * 10) + 
    (startsWithActionVerb ? 30 : 0) + 
    (hasGoalIndicators ? 20 : 0) +
    (wordCount >= OPTIMAL_MIN_LENGTH ? 20 : Math.round((wordCount / OPTIMAL_MIN_LENGTH) * 20))));

  // Calculate overall score (weighted average)
  const overall = Math.round(
    (clarityScore * 0.35) +
    (lengthScore * 0.15) +
    (specificityScore * 0.25) +
    (actionabilityScore * 0.25)
  );

  return {
    clarity: clarityScore,
    length: lengthScore,
    specificity: specificityScore,
    actionability: actionabilityScore,
    overall
  };
}

/**
 * Calculates sentence variety in a prompt
 * @param text The text to analyze
 * @returns Boolean indicating if the text has varied sentence structures
 */
function calculateSentenceVariety(text: string): boolean {
  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  if (sentences.length < 2) return false;
  
  // Check for varied sentence lengths
  const lengths = sentences.map(s => s.trim().split(/\s+/).length);
  const averageLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
  const hasLengthVariation = lengths.some(len => Math.abs(len - averageLength) > 3);
  
  // Check for different sentence starters
  const starters = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase());
  const uniqueStarters = new Set(starters);
  const hasStarterVariation = uniqueStarters.size > 1;
  
  return hasLengthVariation || hasStarterVariation;
}

/**
 * Provides feedback for improving a prompt
 * @param score The PromptScore object
 * @returns Feedback string with suggestions for improvement
 */
export function getPromptFeedback(score: PromptScore): string {
  const feedbackItems = [];

  // Provide feedback based on scores
  if (score.clarity < 60) {
    feedbackItems.push("Make your prompt clearer by using direct language and avoiding vague terms like 'maybe' or 'kind of'.");
  } else if (score.clarity < 80) {
    feedbackItems.push("Consider structuring your prompt with bullet points or clear sections to improve clarity.");
  }
  
  if (score.length < 40) {
    feedbackItems.push("Your prompt is too short. Adding more details (aim for 40-200 words) will significantly improve results.");
  } else if (score.length < 70) {
    feedbackItems.push("While your prompt has good length, adding a few more specific details could improve results.");
  } else if (score.length > 95) {
    feedbackItems.push("Your prompt might be too long. Consider focusing on the most important points.");
  }
  
  if (score.specificity < 50) {
    feedbackItems.push("Add specific details, examples, or parameters (like numbers, dates, or measurements) to your prompt.");
  } else if (score.specificity < 75) {
    feedbackItems.push("Add context about your target audience or intended purpose to make your prompt more specific.");
  }
  
  if (score.actionability < 50) {
    feedbackItems.push("Start with a clear action verb (like 'create', 'explain', or 'analyze') to make your intention explicit.");
  } else if (score.actionability < 75) {
    feedbackItems.push("Consider adding clear goals or desired outcomes to make your prompt more actionable.");
  }

  // If scores are all good, provide positive feedback
  if (score.overall >= 85) {
    return "Your prompt is well-crafted! It's clear, specific, and actionable.";
  } else if (feedbackItems.length === 0) {
    return "Your prompt is good, but could be improved for even better results.";
  }

  return feedbackItems.join(" ");
}
