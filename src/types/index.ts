
export interface RefinedPrompt {
  tag: string;
  prompt: string;
}

export interface RefinedPromptClient extends RefinedPrompt {
  id: string;
  originalPrompt: string;
}

export interface AiPlatform {
  name: string;
  url: (prompt: string) => string;
  icon?: React.ComponentType<{ className?: string }>;
}
