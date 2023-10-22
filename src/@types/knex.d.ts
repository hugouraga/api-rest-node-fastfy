// eslint-disable-next-line
import knex from 'knex'

declare module 'knex/types/tables' {
  interface Transactions {
    id: string
    title: string
    amount: number
    created_at: string
    update_at: string
    session_id?: string
  }

  export interface Tables {
    transactions: Transactions
  }
}
