import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SponsorSidebar } from '@/components/layout/SponsorSidebar'

export default async function SponsorDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${locale}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'sponsor') redirect(`/${locale}`)
  if (!profile.onboarding_completed) redirect(`/${locale}/onboarding`)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <SponsorSidebar profile={profile} locale={locale} />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
