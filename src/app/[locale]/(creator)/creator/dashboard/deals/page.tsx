'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatPrice, DealStatus } from '@/lib/supabase/types'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Upload } from 'lucide-react'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  accepted: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-slate-100 text-slate-600',
  disputed: 'bg-red-100 text-red-700',
}

export default function CreatorDealsPage() {
  const t = useTranslations('deals')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [proofDeal, setProofDeal] = useState<any>(null)
  const [proofNote, setProofNote] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const load = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
    const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile!.id).single()

    const { data } = await supabase
      .from('deals')
      .select('*, packages(title), sponsors(company_name, profiles(full_name))')
      .eq('creator_id', creator!.id)
      .order('created_at', { ascending: false })

    setDeals(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateDealStatus = async (dealId: string, status: DealStatus, note?: string) => {
    setActionLoading(true)
    const supabase = createClient()
    const updates: Record<string, unknown> = { status }
    if (status === 'accepted') updates.accepted_at = new Date().toISOString()
    if (status === 'completed') updates.completed_at = new Date().toISOString()

    const { error } = await supabase.from('deals').update(updates).eq('id', dealId)
    if (error) { toast.error(error.message); setActionLoading(false); return }

    await supabase.from('deal_events').insert({ deal_id: dealId, status, note })
    toast.success(tCommon('success'))
    await load()
    setActionLoading(false)
  }

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!proofDeal) return
    setActionLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('deals').update({
      status: 'in_progress',
      proof_url: proofUrl,
      proof_note: proofNote,
    }).eq('id', proofDeal.id)

    if (error) { toast.error(error.message) }
    else {
      await supabase.from('deal_events').insert({ deal_id: proofDeal.id, status: 'in_progress', note: 'Sübut yükləndi' })
      toast.success('Sübut göndərildi')
      setProofDeal(null)
      await load()
    }
    setActionLoading(false)
  }

  const pending = deals.filter(d => d.status === 'pending')
  const active = deals.filter(d => ['accepted', 'in_progress'].includes(d.status))
  const past = deals.filter(d => ['completed', 'cancelled', 'disputed'].includes(d.status))

  const DealCard = ({ deal }: { deal: any }) => {
    const sponsorName = deal.sponsors?.profiles?.full_name ?? deal.sponsors?.company_name ?? '—'
    return (
      <Card className="mb-3">
        <CardContent className="pt-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="font-semibold text-slate-900">{deal.packages?.title}</div>
              <div className="text-sm text-slate-500 mt-0.5">{sponsorName}</div>
              {deal.message && <div className="text-sm text-slate-600 mt-2 italic">"{deal.message}"</div>}
              <div className="text-sm font-medium mt-2">{formatPrice(deal.creator_payout, deal.currency)} <span className="text-slate-400 font-normal">sizə</span></div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusColors[deal.status]}>{t(deal.status as Parameters<typeof t>[0])}</Badge>
              {deal.status === 'pending' && (
                <>
                  <Button size="sm" className="gap-1" disabled={actionLoading} onClick={() => updateDealStatus(deal.id, 'accepted', 'Kreator qəbul etdi')}>
                    <CheckCircle className="h-3.5 w-3.5" />{t('accept')}
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1 text-red-600 border-red-200" disabled={actionLoading} onClick={() => updateDealStatus(deal.id, 'cancelled', 'Kreator rədd etdi')}>
                    <XCircle className="h-3.5 w-3.5" />{t('decline')}
                  </Button>
                </>
              )}
              {deal.status === 'accepted' && (
                <Button size="sm" className="gap-1" onClick={() => { setProofDeal(deal); setProofUrl(''); setProofNote('') }}>
                  <Upload className="h-3.5 w-3.5" />{t('submitProof')}
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
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">{t('pending')} {pending.length > 0 && `(${pending.length})`}</TabsTrigger>
            <TabsTrigger value="active">Aktiv {active.length > 0 && `(${active.length})`}</TabsTrigger>
            <TabsTrigger value="past">Keçmiş</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-4">
            {pending.length === 0 ? <p className="text-slate-400 text-center py-12">{t('noDeal')}</p>
              : pending.map(d => <DealCard key={d.id} deal={d} />)}
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            {active.length === 0 ? <p className="text-slate-400 text-center py-12">{t('noDeal')}</p>
              : active.map(d => <DealCard key={d.id} deal={d} />)}
          </TabsContent>
          <TabsContent value="past" className="mt-4">
            {past.length === 0 ? <p className="text-slate-400 text-center py-12">{t('noDeal')}</p>
              : past.map(d => <DealCard key={d.id} deal={d} />)}
          </TabsContent>
        </Tabs>
      )}

      {/* Proof dialog */}
      <Dialog open={!!proofDeal} onOpenChange={o => !o && setProofDeal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('submitProof')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitProof} className="space-y-4">
            <div className="space-y-2">
              <Label>Sübut linki (screenshot, post URL)</Label>
              <input
                type="url"
                value={proofUrl}
                onChange={e => setProofUrl(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="https://..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Qeyd</Label>
              <Textarea
                value={proofNote}
                onChange={e => setProofNote(e.target.value)}
                rows={3}
                placeholder="Çatdırma haqqında qeyd..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={actionLoading}>
              {actionLoading ? tCommon('loading') : tCommon('submit')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
