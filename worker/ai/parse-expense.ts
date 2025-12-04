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

  // Extract amount - handle various formats
  const amountMatch = input.match(/\$?(\d+(?:[.,]\d{1,2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;

  let category: ExpenseCategory = 'Other';
  let merchant = 'Unknown';

  // Better category detection
  if (/(coffee|starbucks|food|lunch|dinner|breakfast|restaurant|cafe|pizza|burger|sandwich|groceries|grocery|ice cream|snack|meal|eat)/i.test(input)) {
    category = 'Food & Dining';
    const merchantMatch = input.match(/(starbucks|mcdonald|burger king|pizza hut|domino|subway|chipotle|panera|dunkin|ice cream|in and out|h&m)/i);
    if (merchantMatch) {
      merchant = merchantMatch[1].split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    } else {
      merchant = category === 'Food & Dining' ? 'Restaurant' : merchant;
    }
  } else if (/(gas|uber|lyft|taxi|parking|metro|bus|train|flight|car)/i.test(input)) {
    category = 'Transportation';
    merchant = 'Transportation';
  } else if (/(shop|shopping|amazon|walmart|target|store|buy|bought|purchase|mall|retail|h&m|clothes|clothing)/i.test(input)) {
    category = 'Shopping';
    merchant = 'Store';
  } else if (/(movie|netflix|spotify|game|gaming|entertainment|concert|show|theatre|theater)/i.test(input)) {
    category = 'Entertainment';
    merchant = 'Entertainment';
  } else if (/(rent|mortgage|electric|water|internet|phone|bill|utility|utilities)/i.test(input)) {
    category = 'Bills & Utilities';
    merchant = 'Utilities';
  } else if (/(doctor|hospital|pharmacy|medicine|health|medical|dental)/i.test(input)) {
    category = 'Healthcare';
    merchant = 'Healthcare';
  }

  // Try to extract merchant name from capitalized words
  const words = input.split(/\s+/);
  const capitalizedWords = words.filter((w: string) =>
    w.length > 2 &&
    w[0] === w[0].toUpperCase() &&
    !['I', 'A', 'The', 'On', 'At', 'In', 'For'].includes(w)
  );

  if (capitalizedWords.length > 0 && merchant === 'Unknown') {
    merchant = capitalizedWords[0];
  }

  return {
    amount,
    merchant,
    category,
    message: amount > 0
      ? `Added $${amount.toFixed(2)} ${merchant !== 'Unknown' ? `at ${merchant}` : ''} to ${category}.`
      : 'Please specify an amount for the expense.',
    success: amount > 0
  };
}
