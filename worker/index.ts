import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { FinanceMemory } from './durable-objects/FinanceMemory';
import type { Expense, AddExpenseRequest } from './types/expense';
import type { Env } from './types/env';

// Export Durable Object class
export { FinanceMemory };

const app = new Hono<{ Bindings: Env }>();

app.use('/*', cors());

app.get('/', (c) => {
  return c.json({
    name: 'Finance Tracker API',
    version: '1.0.0',
    status: 'running'
  });
});

// POST /api/expenses - Add expense
app.post('/api/expenses', async (c) => {
  try {
    console.log('📥 API: Adding expense');

    const body = await c.req.json() as AddExpenseRequest;

    if (!body.userId || !body.amount || !body.description) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const expense: Expense = {
      id: crypto.randomUUID(),
      amount: Number(body.amount),
      category: 'Uncategorized',
      description: body.description,
      date: new Date().toISOString().split('T')[0],
      createdAt: Date.now()
    };

    const id = c.env.FINANCE_MEMORY.idFromName(body.userId);
    const stub = c.env.FINANCE_MEMORY.get(id) as unknown as FinanceMemory;

    await stub.addExpense(expense);

    console.log('API: Success');

    return c.json({ success: true, expense });

  } catch (err) {
    console.error('API Error:', err);
    return c.json({ error: String(err) }, 500);
  }
});

// GET /api/expenses/:userId - Get expenses
app.get('/api/expenses/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    const id = c.env.FINANCE_MEMORY.idFromName(userId);
    const stub = c.env.FINANCE_MEMORY.get(id) as unknown as FinanceMemory;

    const expenses = await stub.getExpenses();

    return c.json({
      success: true,
      expenses,
      count: expenses.length
    });

  } catch (err) {
    console.error('API Error:', err);
    return c.json({ error: String(err) }, 500);
  }
});

// DELETE /api/expenses/:userId - Clear expenses
app.delete('/api/expenses/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');

    const id = c.env.FINANCE_MEMORY.idFromName(userId);
    const stub = c.env.FINANCE_MEMORY.get(id) as unknown as FinanceMemory;

    await stub.clearExpenses();

    return c.json({ success: true });

  } catch (err) {
    console.error('API Error:', err);
    return c.json({ error: String(err) }, 500);
  }
});

export default app;
