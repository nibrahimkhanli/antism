'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Package, Deliverable, Currency } from '@/lib/supabase/types'
import { Plus, X } from 'lucide-react'

const DELIVERABLE_PRESETS = [
  { type: 'mention', label: 'Mention / Xatırlatma' },
  { type: 'dedicated_episode', label: 'Dedicated epizod' },
  { type: 'pre_roll', label: 'Pre-roll reklam' },
  { type: 'mid_roll', label: 'Mid-roll reklam' },
  { type: 'social_post', label: 'Sosial media postu' },
  { type: 'story', label: 'Story' },
  { type: 'logo', label: 'Logo yerləşdirmə' },
  { type: 'banner', label: 'Banner' },
  { type: 'appearance', label: 'Hadisə görünüşü' },
]

interface PackageFormProps {
  initial?: Partial<Package>
  onSubmit: (data: Omit<Package, 'id' | 'creator_id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function PackageForm({ initial, onSubmit, onCancel, loading }: PackageFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price, setPrice] = useState(initial?.price ? String(initial.price / 100) : '')
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? 'AZN')
  const [duration, setDuration] = useState(String(initial?.duration_days ?? 30))
  const [deliverables, setDeliverables] = useState<Deliverable[]>(initial?.deliverables ?? [])
  const [customLabel, setCustomLabel] = useState('')

  const addPreset = (preset: { type: string; label: string }) => {
    if (deliverables.some(d => d.type === preset.type)) return
    setDeliverables(d => [...d, { type: preset.type, label: preset.label, qty: 1 }])
  }

  const removeDeliverable = (type: string) => {
    setDeliverables(d => d.filter(x => x.type !== type))
  }

  const addCustom = () => {
    if (!customLabel.trim()) return
    setDeliverables(d => [...d, { type: `custom_${Date.now()}`, label: customLabel.trim() }])
    setCustomLabel('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      title,
      description,
      price: Math.round(parseFloat(price) * 100),
      currency,
      duration_days: parseInt(duration),
      deliverables,
      cover_image_url: initial?.cover_image_url ?? null,
      status: initial?.status ?? 'active',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label>Paket adı *</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label>Təsvir</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Qiymət *</Label>
          <Input type="number" min="1" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Valyuta</Label>
          <Select value={currency} onValueChange={v => v && setCurrency(v as Currency)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="AZN">AZN (₼)</SelectItem>
              <SelectItem value="RUB">RUB (₽)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Müddət (gün) *</Label>
        <Input type="number" min="1" value={duration} onChange={e => setDuration(e.target.value)} required />
      </div>

      <div className="space-y-3">
        <Label>Çatdırılacaqlar</Label>
        <div className="flex flex-wrap gap-2">
          {DELIVERABLE_PRESETS.map(p => (
            <button
              key={p.type}
              type="button"
              onClick={() => addPreset(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                deliverables.some(d => d.type === p.type)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={customLabel}
            onChange={e => setCustomLabel(e.target.value)}
            placeholder="Xüsusi əlavə et..."
            className="text-sm"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          />
          <Button type="button" variant="outline" size="icon" onClick={addCustom}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {deliverables.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {deliverables.map(d => (
              <Badge key={d.type} variant="secondary" className="gap-1 pr-1">
                {d.label}
                <button type="button" onClick={() => removeDeliverable(d.type)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saxlanılır...' : 'Saxla'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Ləğv et
        </Button>
      </div>
    </form>
  )
}
