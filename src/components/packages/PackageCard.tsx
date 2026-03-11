'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Package, formatPrice } from '@/lib/supabase/types'
import { Clock, CheckCircle2, Pencil, Pause, Play, Trash2 } from 'lucide-react'

interface PackageCardProps {
  pkg: Package
  mode?: 'public' | 'manage'
  onSponsor?: (pkg: Package) => void
  onEdit?: (pkg: Package) => void
  onToggle?: (pkg: Package) => void
  onDelete?: (pkg: Package) => void
}

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  draft: 'bg-slate-100 text-slate-600',
}

const statusLabels = {
  active: 'Aktiv',
  paused: 'Dayandırılıb',
  draft: 'Qaralama',
}

export function PackageCard({ pkg, mode = 'public', onSponsor, onEdit, onToggle, onDelete }: PackageCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow">
      {pkg.cover_image_url && (
        <div className="h-40 rounded-t-lg overflow-hidden">
          <img src={pkg.cover_image_url} alt={pkg.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 leading-tight">{pkg.title}</h3>
          {mode === 'manage' && (
            <Badge className={`text-xs shrink-0 ${statusColors[pkg.status]}`}>
              {statusLabels[pkg.status]}
            </Badge>
          )}
        </div>
        {pkg.description && (
          <p className="text-sm text-slate-500 line-clamp-2">{pkg.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {pkg.deliverables.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {pkg.deliverables.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                {d.label}{d.qty && d.qty > 1 ? ` (x${d.qty})` : ''}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {pkg.duration_days} gün
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex items-center justify-between gap-3">
        <div className="font-bold text-lg text-slate-900">
          {formatPrice(pkg.price, pkg.currency)}
        </div>

        {mode === 'public' && (
          <Button size="sm" onClick={() => onSponsor?.(pkg)}>
            Sponsorluq et
          </Button>
        )}

        {mode === 'manage' && (
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit?.(pkg)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onToggle?.(pkg)}>
              {pkg.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => onDelete?.(pkg)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
