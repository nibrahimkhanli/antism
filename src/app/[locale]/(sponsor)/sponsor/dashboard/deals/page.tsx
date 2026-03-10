'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatPrice } from '@/lib/supabase/types'
import { toast } from 'sonner'
import { CheckCircle, ExternalLink } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-600',
  disputed: 'bg-red-100 text-red-700',
}

export default function SponsorDealsPage() {
  const t = useTranslations('deals')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const load = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
    const { data: sponsor } = await supabase.from('sponsors').select('id').eq('profile_id', profile!.id).single()

    const { data } = await supabase
      .from('deals')
      .select('*, packages(title), creators(id, profiles(full_name))')
      .eq('sponsor_id', sponsor!.id)
      .order('created_at', { ascending: false })

    setDeals(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const confirmDelivery = async (dealId: string) => {
    setActionLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('deals').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', dealId)

    if (error) { toast.error(error.message) }
    else {
      await supabase.from('deal_events').insert({ deal_id: dealId, status: 'completed', note: 'Sponsor çatdırmanı təsdiqlədi' })
      toast.success('Sövdələşmə tamamlandı')
      await load()
    }
    setActionLoading(false)
  }

  const pending = deals.filter(d => d.status === 'pending')
  const active = deals.filter(d => ['accepted', 'in_progress'].includes(d.status))
  const past = deals.filter(d => ['completed', 'cancelled', 'disputed'].includes(d.status))

  const DealCard = ({ deal }: { deal: any }) => {
    const creatorName = (deal.creators?.profiles as { full_name: string })?.full_name ?? '—'
    return (
      <Card className="mb-3">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-semibold text-slate-900">{deal.packages?.title}</div>
              <div className="text-sm text-slate-500 mt-0.5">{creatorName}</div>
              <div className="text-sm font-medium mt-2">{formatPrice(deal.total_price, deal.currency)}</div>
              {deal.proof_url && (
                <a href={deal.proof_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2">
                  <ExternalLink className="h-3.5 w-3.5" /> Sübuta bax
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusColors[deal.status]}>{t(deal.status as Parameters<typeof t>[0])}</Badge>
              {deal.status === 'in_progress' && deal.proof_url && (
                <Button size="sm" className="gap-1" disabled={actionLoading} onClick={() => confirmDelivery(deal.id)}>
                  <CheckCircle className="h-3.5 w-3.5" />{t('confirmDelivery')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
      {loading ? (
        <div className="text-slate-400 text-center py-20">{tCommon('loading')}</div>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Aktiv {active.length > 0 && `(${active.length})`}</TabsTrigger>
            <TabsTrigger value="pending">{t('pending')} {pending.length > 0 && `(${pending.length})`}</TabsTrigger>
            <TabsTrigger value="past">Keçmiş</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            {active.length === 0 ? <p className="text-slate-400 text-center py-12">{t('noDeal')}</p>
              : active.map(d => <DealCard key={d.id} deal={d} />)}
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            {pending.length === 0 ? <p className="text-slate-400 text-center py-12">{t('noDeal')}</p>
              : pending.map(d => <DealCard key={d.id} deal={d} />)}
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            {past.length === 0 ? <p className="text-slate-400 text-center py-12">{t('noDeal')}</p>
              : past.map(d => <DealCard key={d.id} deal={d} />)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
