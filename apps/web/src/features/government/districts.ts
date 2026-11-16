import { m } from '@/paraglide/messages'
import { demographics, officials } from './data'

/** The four districts in order (district n is districts[n - 1]), shared by the Government and Legislative pages. */
export const districts = [
  m.gov_district_1,
  m.gov_district_2,
  m.gov_district_3,
  m.gov_district_4,
].map((label, i) => {
  const lgus = demographics.lgus.filter((lgu) => lgu.district === i + 1)
  return {
    label,
    boardMembers: officials.board_members.filter((member) => member.district === i + 1),
    representative: officials.representatives.find((rep) => rep.district === i + 1)?.name,
    lguNames: lgus
      .map((lgu) => lgu.name)
      .sort((a, b) => a.localeCompare(b))
      .join(', '),
    population: lgus.reduce((total, lgu) => total + lgu.population_2020, 0),
  }
})

export const districtLabel = (district: number) => districts[district - 1]?.label() ?? ''
