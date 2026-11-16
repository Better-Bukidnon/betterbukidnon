import { z } from 'zod'
import competitiveIndexJson from '../../../../../data/competitive-index.json'
import { parseContent } from '@/lib/schemas'

const score = z.number().nullable()

// DTI CMCI scores; the page shows the empty state until `years` and some scores are filled in.
const competitiveIndexSchema = z.object({
  years: z.array(z.union([z.number(), z.string()])),
  overall: z.array(score),
  pillars: z.array(z.object({ id: z.string(), name: z.string(), scores: z.array(score) })),
})

export const competitiveIndex = parseContent(
  competitiveIndexSchema,
  competitiveIndexJson,
  'data/competitive-index.json',
)
