'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PackageCard } from '@/components/packages/PackageCard'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Package, calculateFees } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface DealRequestButtonProps {
  pkg: Package
  sponsorId: string | null
  creatorId: string
}

export function DealRequestButton({ pkg, sponsorId, creatorId }: DealRequestButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSponsor = () => {
    if (!sponsorId) {
      router.push('/login')
      return
    }
    setOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { platformFee, creatorPayout } = calculateFees(pkg.price)

    const { data: deal, error } = await supabase.from('deals').insert({
      package_id: pkg.id,
      sponsor_id: sponsorId,
      creator_id: creatorId,
      status: 'pending',
      message,
      total_price: pkg.price,
      currency: pkg.currency,
      platform_fee: platformFee,
      creator_payout: creatorPayout,
    }).select().single()

    if (error) { toast.error(error.message); setLoading(false); return }

    await supabase.from('deal_events').insert({
      deal_id: deal.id,
      status: 'pending',
      note: 'Sövdələşmə sorğusu göndərildi',
    })

    toast.success('Sorğu göndərildi!')
    setOpen(false)
    router.push('/sponsor/dashboard/deals')
    setLoading(false)
  }

  return (
    <>
      <PackageCard pkg={pkg} mode="public" onSponsor={handleSponsor} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sponsorluq sorğusu</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mb-2">
            <div className="font-semibold text-slate-900">{pkg.title}</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Mesaj</Label>
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Brendiniz və sponsorluq məqsədiniz haqqında yazın..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Göndərilir...' : 'Sorğu göndər'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
