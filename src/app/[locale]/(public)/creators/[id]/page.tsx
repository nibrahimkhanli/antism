import { createClient } from '@/lib/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { PackageCard } from '@/components/packages/PackageCard'
import { DealRequestButton } from '@/components/deals/DealRequestButton'
import { Package, formatPrice } from '@/lib/supabase/types'
import { Mic, Trophy, Calendar, CheckCircle, Star, Users, Instagram, Youtube } from 'lucide-react'

const typeLabels: Record<string, string> = {
  podcaster: 'Podkastçı',
  athlete: 'İdmançı',
  event: 'Tədbir Təşkilatçısı',
}

const typeIcons: Record<string, typeof Mic> = {
  podcaster: Mic,
  athlete: Trophy,
  event: Calendar,
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const supabase = await createClient()
  const t = await getTranslations('packages')

  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  let sponsorId: string | null = null
  if (user) {
    const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
    profile = p
    if (p?.role === 'sponsor') {
      const { data: sp } = await supabase.from('sponsors').select('id').eq('profile_id', p.id).single()
      sponsorId = sp?.id ?? null
    }
  }

  const { data: creator } = await supabase
    .from('creators')
    .select('*, profiles(full_name, avatar_url, country)')
    .eq('id', id)
    .single()

  if (!creator) notFound()

  const { data: packages } = await supabase
    .from('packages')
    .select('*')
    .eq('creator_id', id)
    .eq('status', 'active')
    .order('price')

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(full_name, avatar_url)')
    .eq('reviewee_id', creator.profile_id)
    .order('created_at', { ascending: false })
    .limit(5)

  const avgRating = reviews?.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null

  const creatorProfile = creator.profiles as { full_name: string; avatar_url: string | null; country: string }
  const Icon = typeIcons[creator.type] ?? Mic

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar profile={profile} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={creatorProfile.avatar_url ?? ''} />
              <AvatarFallback className="text-2xl">{creatorProfile.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <h1 className="text-2xl font-bold text-slate-900">{creatorProfile.full_name}</h1>
                {creator.verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="gap-1">
                  <Icon className="h-3.5 w-3.5" />
                  {typeLabels[creator.type]}
                </Badge>
                {creator.category && <Badge variant="secondary">{creator.category}</Badge>}
                <Badge variant="outline">{creatorProfile.country === 'AZ' ? 'Azərbaycan' : 'Rusiya'}</Badge>
              </div>
              {creator.bio && <p className="text-slate-600 max-w-2xl">{creator.bio}</p>}

              <div className="flex flex-wrap gap-6 mt-5 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="h-4 w-4" />
                  <span className="font-semibold text-slate-900">{creator.reach_count.toLocaleString()}</span> izləyici
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Star className="h-4 w-4" />
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-slate-400">({reviews?.length} rəy)</span>
                  </div>
                )}
                {creator.social_links?.instagram && (
                  <a href={`https://instagram.com/${creator.social_links.instagram.replace('@', '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900">
                    <Instagram className="h-4 w-4" />
                    {creator.social_links.instagram}
                  </a>
                )}
                {creator.social_links?.youtube && (
                  <a href={creator.social_links.youtube} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900">
                    <Youtube className="h-4 w-4" />
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Packages */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-5">{t('title')}</h2>
          {packages && packages.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {packages.map(pkg => (
                <DealRequestButton
                  key={pkg.id}
                  pkg={pkg as Package}
                  sponsorId={sponsorId}
                  creatorId={creator.id}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-12">{t('noPackages')}</p>
          )}
        </div>

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Rəylər</h2>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white rounded-xl border p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">
                        {(review.reviewer as { full_name: string })?.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{(review.reviewer as { full_name: string })?.full_name}</div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-slate-600">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
