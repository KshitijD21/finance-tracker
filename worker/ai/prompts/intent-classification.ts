/**
 * INTENT CLASSIFICATION PROMPT
 */

export const INTENTS = {
  ADD_EXPENSE: 'ADD_EXPENSE',
  QUERY: 'QUERY',
  DELETE_EXPENSE: 'DELETE_EXPENSE',  // NEW!
  HELP: 'HELP',
  UNKNOWN: 'UNKNOWN'
} as const;

export type Intent = typeof INTENTS[keyof typeof INTENTS];

export function getIntentPrompt(input: string): string {
  return `Classify the user's intent from their input.

USER INPUT: "${input}"

INTENTS:
1. ADD_EXPENSE - User is logging/adding a new expense
   Examples:
   - "I spent $50 on coffee"
   - "Bought groceries for $120"
   - "Gas was $60"

2. QUERY - User is asking about their expenses/spending
   Examples:
   - "How much did I spend on food?"
   - "What's my total this week?"
   - "Show me my coffee expenses"

3. DELETE_EXPENSE - User wants to delete/remove an expense
   Examples:
   - "Delete the pizza expense"
   - "Remove the Starbucks payment"
   - "Delete that $50 coffee"
   - "Remove last expense"
   - "Delete the wrong one"

4. HELP - User needs help
   Examples:
   - "What can you do?"
   - "Help"

5. UNKNOWN - Cannot determine intent

RULES:
- If mentions "delete", "remove", "cancel", "undo" → DELETE_EXPENSE
- If mentions spending/buying WITH amount → ADD_EXPENSE
- If asks questions about money → QUERY

OUTPUT (JSON only):
{
  "intent": "DELETE_EXPENSE",
  "confidence": 0.95
}`;
}

export const INTENT_SYSTEM_MESSAGE =
  'You classify user intent accurately. Respond with JSON only.';

export const INTENT_CONFIG = {
  temperature: 0.1,
  max_tokens: 50
} as const;
