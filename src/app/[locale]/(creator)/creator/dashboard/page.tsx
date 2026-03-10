import { createClient } from '@/lib/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/supabase/types'
import { TrendingUp, Handshake, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

export default async function CreatorDashboardPage() {
  const locale = await getLocale()
  const t = await getTranslations('dashboard')
  const tDeals = await getTranslations('deals')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user!.id).single()
  const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile!.id).single()

  const [
    { data: deals },
    { data: reviews },
  ] = await Promise.all([
    supabase.from('deals').select('*, packages(title, currency)').eq('creator_id', creator!.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('reviews').select('rating').eq('reviewee_id', profile!.id),
  ])

  const completedDeals = deals?.filter(d => d.status === 'completed') ?? []
  const activeDeals = deals?.filter(d => ['accepted', 'in_progress'].includes(d.status)) ?? []
  const pendingDeals = deals?.filter(d => d.status === 'pending') ?? []
  const totalEarnings = completedDeals.reduce((sum, d) => sum + d.creator_payout, 0)
  const avgRating = reviews?.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  const stats = [
    { label: t('totalEarnings'), value: totalEarnings > 0 ? formatPrice(totalEarnings, 'AZN') : '—', icon: TrendingUp, color: 'text-emerald-600' },
    { label: t('activeDeals'), value: String(activeDeals.length), icon: Handshake, color: 'text-blue-600' },
    { label: t('completedDeals'), value: String(completedDeals.length), icon: CheckCircle, color: 'text-purple-600' },
    { label: t('avgRating'), value: avgRating ? `${avgRating} ★` : '—', icon: Star, color: 'text-amber-500' },
  ]

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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('overview')}</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
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

      {/* Pending requests */}
      {pendingDeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gözləyən sorğular ({pendingDeals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDeals.map(deal => (
                <Link
                  key={deal.id}
                  href={`/${locale}/creator/dashboard/deals`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900">{deal.packages?.title}</div>
                    <div className="text-xs text-slate-500">{formatPrice(deal.total_price, deal.currency)}</div>
                  </div>
                  <Badge className={statusColors[deal.status]}>
                    {tDeals(deal.status as Parameters<typeof tDeals>[0])}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent deals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            Son sövdələşmələr
            <Link href={`/${locale}/creator/dashboard/deals`} className="text-sm font-normal text-blue-600 hover:underline">
              Hamısını gör →
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deals && deals.length > 0 ? (
            <div className="space-y-2">
              {deals.map(deal => (
                <div key={deal.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{deal.packages?.title}</div>
                    <div className="text-xs text-slate-500">{new Date(deal.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{formatPrice(deal.creator_payout, deal.currency)}</span>
                    <Badge className={`text-xs ${statusColors[deal.status]}`}>
                      {tDeals(deal.status as Parameters<typeof tDeals>[0])}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">{tDeals('noDeal')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
