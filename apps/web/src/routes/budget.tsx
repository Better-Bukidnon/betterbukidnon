import { createFileRoute } from '@tanstack/react-router'
import { BudgetPage } from '@/features/transparency/budget-page'
import { seo } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/budget')({
  head: () =>
    seo({ title: m.seo_budget_title(), description: m.seo_budget_description(), path: '/budget' }),
  component: BudgetPage,
})
