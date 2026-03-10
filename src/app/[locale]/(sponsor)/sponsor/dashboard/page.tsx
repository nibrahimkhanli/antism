import { createClient } from '@/lib/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { formatPrice } from '@/lib/supabase/types'
import { CreditCard, Handshake, CheckCircle, Search } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function SponsorDashboardPage() {
  const locale = await getLocale()
  const t = await getTranslations('dashboard')
  const tDeals = await getTranslations('deals')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user!.id).single()
  const { data: sponsor } = await supabase.from('sponsors').select('id').eq('profile_id', profile!.id).single()

  const { data: deals } = await supabase
    .from('deals')
    .select('*, packages(title, currency), creators(profiles(full_name))')
    .eq('sponsor_id', sponsor!.id)
    .order('created_at', { ascending: false })
    .limit(10)

  const activeDeals = deals?.filter(d => ['pending', 'accepted', 'in_progress'].includes(d.status)) ?? []
  const completedDeals = deals?.filter(d => d.status === 'completed') ?? []
  const totalSpent = completedDeals.reduce((s, d) => s + d.total_price, 0)

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    accepted: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-100 text-slate-600',
    disputed: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('overview')}</h1>
        <Link href={`/${locale}/browse`} className={cn(buttonVariants(), 'gap-2')}>
          <Search className="h-4 w-4" />
          Kreator tap
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('activeDeals'), value: String(activeDeals.length), icon: Handshake, color: 'text-blue-600' },
          { label: t('completedDeals'), value: String(completedDeals.length), icon: CheckCircle, color: 'text-emerald-600' },
          { label: t('totalSpent'), value: totalSpent > 0 ? formatPrice(totalSpent, 'AZN') : '—', icon: CreditCard, color: 'text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-100 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">{value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Sövdələşmələr
            <Link href={`/${locale}/sponsor/dashboard/deals`} className="text-sm font-normal text-blue-600 hover:underline">
              Hamısını gör →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deals && deals.length > 0 ? (
            <div className="space-y-2">
              {deals.map(deal => {
                const creatorName = (deal.creators?.profiles as { full_name: string })?.full_name ?? '—'
                return (
                  <div key={deal.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{deal.packages?.title}</div>
                      <div className="text-xs text-slate-500">{creatorName}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatPrice(deal.total_price, deal.currency)}</span>
                      <Badge className={`text-xs ${statusColors[deal.status]}`}>
                        {tDeals(deal.status as Parameters<typeof tDeals>[0])}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">{tDeals('noDeal')}</p>
              <Link href={`/${locale}/browse`} className={cn(buttonVariants({ variant: 'outline' }))}>Kreator tap</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
