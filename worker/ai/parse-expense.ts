import { getExpenseEntryPrompt, SYSTEM_MESSAGE, AI_CONFIG, type ExpenseCategory } from './prompts/expense-entry';

export interface ProcessedExpense {
  amount: number;
  merchant: string;
  category: ExpenseCategory;
  message: string;
  success: boolean;
  error?: string;
}

export async function processExpenseInput(
  AI: Ai,
  input: string
): Promise<ProcessedExpense> {

  console.log('🤖 AI: Processing expense input:', input);

  try {
    const userPrompt = getExpenseEntryPrompt(input);

    console.log('🤖 AI: Sending prompt to AI');

    const response = await AI.run(
      AI_CONFIG.model,
      {
        messages: [
          {
            role: 'system',
            content: SYSTEM_MESSAGE
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.max_tokens
      }
    ) as { response?: string; result?: { response?: string } } | string;

    console.log('🤖 AI: Got response:', response);

    let aiText = '';

    if (typeof response === 'string') {
      aiText = response;
    } else if (response.response) {
      aiText = response.response;
    } else if (response.result?.response) {
      aiText = response.result.response;
    }

    console.log('🤖 AI: Extracted text:', aiText);

    if (!aiText) {
      console.error('❌ AI: Empty response');
      return fallbackParsing(input);
    }

    const jsonMatch = aiText.match(/\{[\s\S]*?\}/);

    if (!jsonMatch) {
      console.error('❌ AI: No JSON found in response');
      return fallbackParsing(input);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    console.log('✅ AI: Parsed result:', parsed);

    if (!parsed.amount || !parsed.category || !parsed.message) {
      console.error('❌ AI: Missing required fields in response');
      return fallbackParsing(input);
    }

    return {
      amount: Number(parsed.amount),
      merchant: parsed.merchant || 'Unknown',
      category: parsed.category,
      message: parsed.message,
      success: true
    };

  } catch (error) {
    console.error('❌ AI Error:', error);
    return fallbackParsing(input);
  }
}

function fallbackParsing(input: string): ProcessedExpense {
  console.log('⚠️ Using fallback parsing for:', input);

  const amountMatch = input.match(/\$?(\d+(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

  const lower = input.toLowerCase();
  let category: ExpenseCategory = 'Other';

  if (lower.includes('coffee') || lower.includes('starbucks') || lower.includes('food') ||
      lower.includes('lunch') || lower.includes('dinner') || lower.includes('restaurant') ||
      lower.includes('groceries') || lower.includes('grocery')) {
    category = 'Food & Dining';
  } else if (lower.includes('gas') || lower.includes('uber') || lower.includes('lyft') ||
             lower.includes('parking')) {
    category = 'Transportation';
  } else if (lower.includes('shop') || lower.includes('amazon') || lower.includes('walmart') ||
             lower.includes('target')) {
    category = 'Shopping';
  } else if (lower.includes('movie') || lower.includes('netflix') || lower.includes('spotify')) {
    category = 'Entertainment';
  }

  const words = input.split(' ');
  const capitalizedWords = words.filter(w => w.length > 2 && w[0] === w[0].toUpperCase());
  const merchant = capitalizedWords[0] || 'Unknown';

  return {
    amount,
    merchant,
    category,
    message: `Added $${amount} to ${category}.`,
    success: true
  };
}
