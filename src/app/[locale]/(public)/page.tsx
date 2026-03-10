import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/layout/Navbar'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mic, Trophy, Calendar, ArrowRight, Star, TrendingUp, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function LandingPage() {
  const locale = await getLocale()
  const supabase = await createClient()

let user = null

try {
  const { data } = await supabase.auth.getUser()
  user = data.user
} catch (e) {
  user = null
}

  let profile = null
  if (user) {
    const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', user.id)
  .maybeSingle()

if (!error) {
  profile = data
}
}

  return (
    <div className="min-h-screen bg-white">
      <Navbar profile={profile} />
      <LandingContent locale={locale} />
    </div>
  )
}

function LandingContent({ locale }: { locale: string }) {
  const t = useTranslations('landing')
  const tCommon = useTranslations('common')

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-blue-600/20 text-blue-300 border-blue-600/30 hover:bg-blue-600/20">
              Azerbaijan · Russia
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${locale}/register?role=sponsor`} className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-slate-900 hover:bg-slate-100 gap-2')}>
                  {t('hero.ctaSponsor')}
                  <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/${locale}/register?role=creator`} className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'border-white/30 text-white hover:bg-white/10')}>
                  {t('hero.ctaCreator')}
              </Link>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              {[
                { value: '30%', label: 'Commission sadəcə' },
                { value: '3', label: 'Kreator tipi' },
                { value: 'AZ + RU', label: 'Bazar' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creator types */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('creatorTypes.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Mic,
                key: 'podcast',
                color: 'bg-purple-100 text-purple-600',
                border: 'border-purple-200',
              },
              {
                icon: Trophy,
                key: 'athlete',
                color: 'bg-blue-100 text-blue-600',
                border: 'border-blue-200',
              },
              {
                icon: Calendar,
                key: 'event',
                color: 'bg-emerald-100 text-emerald-600',
                border: 'border-emerald-200',
              },
            ].map(({ icon: Icon, key, color, border }) => (
              <div
                key={key}
                className={`bg-white rounded-2xl p-8 border ${border} hover:shadow-lg transition-shadow`}
              >
                <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6`}>
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {t(`creatorTypes.${key}` as Parameters<typeof t>[0])}
                </h3>
                <p className="text-slate-500">
                  {t(`creatorTypes.${key}Desc` as Parameters<typeof t>[0])}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('howItWorks.title')}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Sponsors */}
            <div>
              <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider mb-8">
                {t('howItWorks.forSponsors')}
              </h3>
              <div className="space-y-6">
                {[
                  { step: '01', text: t('howItWorks.step1Sponsor'), icon: TrendingUp },
                  { step: '02', text: t('howItWorks.step2Sponsor'), icon: Shield },
                  { step: '03', text: t('howItWorks.step3Sponsor'), icon: Star },
                ].map(({ step, text, icon: Icon }) => (
                  <div key={step} className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {step}
                    </div>
                    <div className="pt-2">
                      <p className="text-slate-700 font-medium">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/register?role=sponsor`} className={cn(buttonVariants(), 'mt-8')}>
                {t('hero.ctaSponsor')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* For Creators */}
            <div>
              <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider mb-8">
                {t('howItWorks.forCreators')}
              </h3>
              <div className="space-y-6">
                {[
                  { step: '01', text: t('howItWorks.step1Creator') },
                  { step: '02', text: t('howItWorks.step2Creator') },
                  { step: '03', text: t('howItWorks.step3Creator') },
                ].map(({ step, text }) => (
                  <div key={step} className="flex gap-5 items-start">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {step}
                    </div>
                    <div className="pt-2">
                      <p className="text-slate-700 font-medium">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/register?role=creator`} className={cn(buttonVariants({ variant: 'outline' }), 'mt-8')}>
                {t('hero.ctaCreator')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">{tCommon('tagline')}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/${locale}/browse`} className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-slate-900 hover:bg-slate-100')}>
              Kreatorları kəşf et
            </Link>
            <Link href={`/${locale}/register`} className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'border-white/30 text-white hover:bg-white/10')}>
              {tCommon('signUp')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-slate-500">
        <p>© 2025 Antism. Bütün hüquqlar qorunur.</p>
      </footer>
    </>
  )
}
