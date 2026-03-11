import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CreatorCard as CreatorCardType, formatPrice } from '@/lib/supabase/types'
import { Mic, Trophy, Calendar, Star, CheckCircle } from 'lucide-react'

const typeIcons = {
  podcaster: Mic,
  athlete: Trophy,
  event: Calendar,
}

const typeColors = {
  podcaster: 'bg-purple-100 text-purple-700',
  athlete: 'bg-blue-100 text-blue-700',
  event: 'bg-emerald-100 text-emerald-700',
}

const typeLabels = {
  podcaster: 'Podkastçı',
  athlete: 'İdmançı',
  event: 'Tədbir',
}

interface CreatorCardProps {
  creator: CreatorCardType
}

export function CreatorCardComponent({ creator }: CreatorCardProps) {
  const Icon = typeIcons[creator.type]

  return (
    <Link href={`/creators/${creator.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={creator.avatar_url ?? ''} />
              <AvatarFallback className="text-lg">{creator.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-900 truncate">{creator.full_name}</span>
                {creator.verified && <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={`text-xs gap-1 ${typeColors[creator.type]}`}>
                  <Icon className="h-3 w-3" />
                  {typeLabels[creator.type]}
                </Badge>
                {creator.category && (
                  <Badge variant="secondary" className="text-xs">{creator.category}</Badge>
                )}
              </div>
            </div>
          </div>

          {creator.bio && (
            <p className="text-sm text-slate-500 mt-4 line-clamp-2">{creator.bio}</p>
          )}

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-slate-500">
              {creator.reach_count.toLocaleString()} izləyici
            </div>
            <div className="flex items-center gap-3">
              {creator.avg_rating && (
                <span className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star className="h-3.5 w-3.5" />
                  {Number(creator.avg_rating).toFixed(1)}
                </span>
              )}
              {creator.min_price && creator.currency && (
                <span className="font-semibold text-slate-900">
                  <span className="text-xs text-slate-500 font-normal mr-1">başlayaraq</span>
                  {formatPrice(creator.min_price, creator.currency)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
