import { describe, expect, it } from 'vite-plus/test'
import { isValidItem, transformPost } from '../../../../../scripts/sync-facebook'
import { news, newsDataSchema } from './data'

describe('news data', () => {
  it('validates news at import time', () => {
    expect(news.news).toEqual([])
  })

  it('accepts Facebook sync output and omits a missing permalink', () => {
    const item = transformPost({
      id: '123',
      message: 'County announcement',
      created_time: '2026-11-18T08:30:00+0000',
    })

    expect(item).not.toHaveProperty('summary')
    expect(item).not.toHaveProperty('url')
    expect(newsDataSchema.parse({ news: [item] }).news[0]).toMatchObject({
      excerpt: 'County announcement',
    })
    expect(isValidItem(item)).toBe(true)
  })
})
