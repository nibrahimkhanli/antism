'use client'

import { useState, use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { CreatorType } from '@/lib/supabase/types'
import { Mic, Trophy, Calendar } from 'lucide-react'

const CATEGORIES = ['Texnologiya', 'İdman', 'Lifestyle', 'Biznes', 'Əyləncə', 'Sağlamlıq', 'Moda', 'Müzik', 'Digər']

export default function OnboardingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const t = useTranslations('onboarding')
  const tCommon = useTranslations('common')
  const tProfile = useTranslations('profile')
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'creator' | 'sponsor' | null>(null)
  const [creatorType, setCreatorType] = useState<CreatorType | null>(null)
  const [step, setStep] = useState<'detect' | 'creator-type' | 'creator-profile' | 'sponsor-profile'>('detect')

  const [creatorForm, setCreatorForm] = useState({
    bio: '', category: '', reach_count: '', audience_country: locale === 'ru' ? 'RU' : 'AZ',
    instagram: '', youtube: '', tiktok: '', podcast_url: '',
  })
  const [sponsorForm, setSponsorForm] = useState({
    company_name: '', industry: '', website: '', description: '',
  })

  // Detect role on mount
  useState(() => {
    const detect = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push(`/${locale}/login`); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('user_id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push(profile.role === 'creator' ? `/${locale}/creator/dashboard` : `/${locale}/sponsor/dashboard`)
        return
      }

      setRole(profile?.role || null)
      setStep(profile?.role === 'creator' ? 'creator-type' : 'sponsor-profile')
    }
    detect()
  })

  const handleCreatorTypeSelect = (type: CreatorType) => {
    setCreatorType(type)
    setStep('creator-profile')
  }

  const handleCreatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
    if (!profile) return

    const { error } = await supabase.from('creators').insert({
      profile_id: profile.id,
      type: creatorType,
      bio: creatorForm.bio,
      category: creatorForm.category,
      reach_count: parseInt(creatorForm.reach_count) || 0,
      audience_country: creatorForm.audience_country,
      social_links: {
        instagram: creatorForm.instagram,
        youtube: creatorForm.youtube,
        tiktok: creatorForm.tiktok,
        podcast_url: creatorForm.podcast_url,
      },
    })

    if (error) { toast.error(error.message); setLoading(false); return }

    await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', profile.id)
    toast.success(tCommon('success'))
    router.push(`/${locale}/creator/dashboard`)
    setLoading(false)
  }

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
    if (!profile) return

    const { error } = await supabase.from('sponsors').insert({
      profile_id: profile.id,
      ...sponsorForm,
    })

    if (error) { toast.error(error.message); setLoading(false); return }

    await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', profile.id)
    toast.success(tCommon('success'))
    router.push(`/${locale}/sponsor/dashboard`)
    setLoading(false)
  }

  if (step === 'detect') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400">{tCommon('loading')}</div>
      </div>
    )
  }

  if (step === 'creator-type') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-2">antism</div>
            <h1 className="text-2xl font-bold text-slate-900">{t('creatorType')}</h1>
          </div>
          <div className="space-y-3">
            {([
              { type: 'podcaster', icon: Mic, color: 'purple', descKey: 'podcastDesc' },
              { type: 'athlete', icon: Trophy, color: 'blue', descKey: 'athleteDesc' },
              { type: 'event', icon: Calendar, color: 'emerald', descKey: 'eventDesc' },
            ] as const).map(({ type, icon: Icon, color, descKey }) => (
              <button
                key={type}
                onClick={() => handleCreatorTypeSelect(type)}
                className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 border-transparent bg-white hover:border-${color}-500 hover:bg-${color}-50 transition-all text-left shadow-sm`}
              >
                <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center shrink-0`}>
                  <Icon className={`h-6 w-6 text-${color}-600`} />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    {t(type as Parameters<typeof t>[0])}
                  </div>
                  <div className="text-sm text-slate-500">{t(descKey)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (step === 'creator-profile') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="text-2xl font-bold mb-2">antism</div>
            <h1 className="text-2xl font-bold text-slate-900">Profilinizi tamamlayın</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleCreatorSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>{tProfile('bio')}</Label>
                  <Textarea
                    value={creatorForm.bio}
                    onChange={e => setCreatorForm(f => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    placeholder="Özünüz haqqında yazın..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>{tProfile('category')}</Label>
                  <Select
                    value={creatorForm.category}
                    onValueChange={v => setCreatorForm(f => ({ ...f, category: v ?? '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kateqoriya seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{tProfile('reach')}</Label>
                  <Input
                    type="number"
                    value={creatorForm.reach_count}
                    onChange={e => setCreatorForm(f => ({ ...f, reach_count: e.target.value }))}
                    placeholder="10000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      value={creatorForm.instagram}
                      onChange={e => setCreatorForm(f => ({ ...f, instagram: e.target.value }))}
                      placeholder="@username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input
                      value={creatorForm.youtube}
                      onChange={e => setCreatorForm(f => ({ ...f, youtube: e.target.value }))}
                      placeholder="URL"
                    />
                  </div>
                </div>
                {creatorType === 'podcaster' && (
                  <div className="space-y-2">
                    <Label>Podkast URL</Label>
                    <Input
                      value={creatorForm.podcast_url}
                      onChange={e => setCreatorForm(f => ({ ...f, podcast_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? tCommon('loading') : 'Profilimi tamamla'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Sponsor profile
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold mb-2">antism</div>
          <h1 className="text-2xl font-bold text-slate-900">Şirkət məlumatları</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSponsorSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>{tProfile('companyName')}</Label>
                <Input
                  value={sponsorForm.company_name}
                  onChange={e => setSponsorForm(f => ({ ...f, company_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{tProfile('industry')}</Label>
                <Input
                  value={sponsorForm.industry}
                  onChange={e => setSponsorForm(f => ({ ...f, industry: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{tProfile('website')}</Label>
                <Input
                  type="url"
                  value={sponsorForm.website}
                  onChange={e => setSponsorForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>{tProfile('bio')}</Label>
                <Textarea
                  value={sponsorForm.description}
                  onChange={e => setSponsorForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? tCommon('loading') : 'Hesabı tamamla'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
