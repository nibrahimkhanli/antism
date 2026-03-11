import { createClient } from '@/lib/supabase/server'
import { getLocale, getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/Navbar'
import { CreatorCardComponent } from '@/components/creators/CreatorCard'
import { CreatorCard, CreatorType } from '@/lib/supabase/types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, Trophy, Calendar } from 'lucide-react'

interface BrowsePageProps {
  searchParams: { type?: string; search?: string; country?: string }
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const locale = await getLocale()
  const t = await getTranslations('browse')
  const supabase = await createClient()

  const { type, search, country } = searchParams

  const { data: { user } } = await supabase.auth.getUser()
  let profile = null
  if (user) {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
    profile = data
  }

  let query = supabase.from('creator_cards').select('*')
  if (type && type !== 'all') query = query.eq('type', type)
  if (country && country !== 'all') query = query.eq('country', country)
  if (search) query = query.ilike('full_name', `%${search}%`)

  const { data: creators } = await query.order('completed_deals_count', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar profile={profile} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('title')}</h1>
          <p className="text-slate-500">{creators?.length ?? 0} kreator tapıldı</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 mb-8 flex flex-wrap gap-4">
          <form className="flex flex-wrap gap-3 w-full">
            <Input
              name="search"
              defaultValue={search}
              placeholder={t('search')}
              className="max-w-xs"
            />
            <Select name="type" defaultValue={type ?? 'all'}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t('filterType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allTypes')}</SelectItem>
                <SelectItem value="podcaster">
                  <span className="flex items-center gap-2"><Mic className="h-3.5 w-3.5" />Podkastçı</span>
                </SelectItem>
                <SelectItem value="athlete">
                  <span className="flex items-center gap-2"><Trophy className="h-3.5 w-3.5" />İdmançı</span>
                </SelectItem>
                <SelectItem value="event">
                  <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" />Tədbir</span>
                </SelectItem>
              </SelectContent>
            </Select>
            <Select name="country" defaultValue={country ?? 'all'}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder={t('filterCountry')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Bütün ölkələr</SelectItem>
                <SelectItem value="AZ">Azərbaycan</SelectItem>
                <SelectItem value="RU">Rusiya</SelectItem>
              </SelectContent>
            </Select>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm hover:bg-slate-800 transition-colors"
            >
              Axtar
            </button>
          </form>
        </div>

        {/* Grid */}
        {creators && creators.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {creators.map(c => (
              <CreatorCardComponent key={c.id} creator={c as CreatorCard} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg">Kreator tapılmadı</p>
          </div>
        )}
      </div>
    </div>
  )
}
