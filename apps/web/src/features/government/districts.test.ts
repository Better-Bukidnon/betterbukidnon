import { describe, expect, it } from 'vite-plus/test'
import { demographics, officials } from './data'
import { districts } from './districts'

describe('districts', () => {
  it('places every LGU and board member in exactly one district', () => {
    const lguCount = districts.reduce((n, d) => n + d.lguNames.split(', ').length, 0)
    expect(lguCount).toBe(demographics.lgus.length)
    expect(districts.flatMap((d) => d.boardMembers)).toHaveLength(officials.board_members.length)
    expect(districts.every((d) => d.representative)).toBe(true)
  })
})
