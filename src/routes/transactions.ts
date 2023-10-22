import { randomUUID } from 'node:crypto'
import { knexDB } from '../database'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Transactions } from 'knex/types/tables'

export async function transactionRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knexDB<Transactions>('transactions').select('')
    return {
      transactions,
    }
  })

  app.get('/:id', async (request) => {
    const getTransactionParamSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getTransactionParamSchema.parse(request.params)
    const transaction = await knexDB<Transactions>('transactions')
      .where('id', id)
      .first()
    return {
      transaction,
    }
  })

  app.get('/summary', async () => {
    const summary = await knexDB<Transactions>('transactions')
      .sum('amount', { as: 'amount' })
      .first()
    return { summary }
  })

  app.post('/', async (request, response) => {
    const createTransactionSchemaBody = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })
    const { amount, title, type } = createTransactionSchemaBody.parse(
      request.body,
    )
    await knexDB('transactions')
      .insert({
        id: randomUUID(),
        title,
        amount: type === 'credit' ? amount : amount * -1,
      })
      .returning('*')
    return response.status(201).send()
  })
}
