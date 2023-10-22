import 'dotenv/config'
import { z } from 'zod'

const envSchemas = z.object({
  DATABASE_URL: z.string(),
  PORT: z.number().default(3334),
})

export const env = envSchemas.parse(process.env)
