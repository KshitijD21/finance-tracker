import { getIntentPrompt, INTENT_SYSTEM_MESSAGE, INTENT_CONFIG, INTENTS, type Intent } from './prompts/intent-classification';

export async function classifyIntent(
  AI: Ai | undefined,
  input: string
): Promise<Intent> {

  if (!AI) {
    return quickIntentDetection(input);
  }

  try {
    const prompt = getIntentPrompt(input);

    const response = await AI.run(
      '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      {
        messages: [
          { role: 'system', content: INTENT_SYSTEM_MESSAGE },
          { role: 'user', content: prompt }
        ],
        temperature: INTENT_CONFIG.temperature,
        max_tokens: INTENT_CONFIG.max_tokens
      }
    ) as { response?: string } | string;

    let text = '';
    if (typeof response === 'string') {
      text = response;
    } else if (response.response) {
      text = response.response;
    }

    // Ensure text is a string before calling .match()
    if (!text || typeof text !== 'string') {
      return quickIntentDetection(input);
    }

    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.intent as Intent;
    }

  } catch (error) {
    // Intent classification error
  }

  return quickIntentDetection(input);
}

// Quick pattern-based detection (UPDATED!)
function quickIntentDetection(input: string): Intent {
  const lower = input.toLowerCase();

  // DELETE_EXPENSE patterns (NEW!)
  if (/(?:delete|remove|cancel|undo|erase|get rid of)/.test(lower)) {
    return INTENTS.DELETE_EXPENSE;
  }

  // ADD_EXPENSE patterns
  if (/(?:spent|bought|paid|purchased|cost|was|got).*\$?\d+/.test(lower)) {
    return INTENTS.ADD_EXPENSE;
  }
  if (/\$?\d+.*(?:spent|bought|paid|for|on)/.test(lower)) {
    return INTENTS.ADD_EXPENSE;
  }

  // QUERY patterns
  if (/(?:how much|what.*spent|show.*expense|total|sum)/i.test(lower)) {
    return INTENTS.QUERY;
  }

  // HELP patterns
  if (/(?:help|what can|how do|commands)/i.test(lower)) {
    return INTENTS.HELP;
  }

  return INTENTS.UNKNOWN;
}
