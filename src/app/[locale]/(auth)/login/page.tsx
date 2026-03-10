'use client'

import { useState, use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Fetch profile to redirect correctly
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('user_id', user.id)
        .single()

      if (!profile?.onboarding_completed) {
        router.push(`/${locale}/onboarding`)
      } else if (profile?.role === 'creator') {
        router.push(`/${locale}/creator/dashboard`)
      } else {
        router.push(`/${locale}/sponsor/dashboard`)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="text-2xl font-bold">antism</Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('loginTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? tCommon('loading') : tCommon('signIn')}
              </Button>
              <p className="text-center text-sm text-slate-500">
                {t('dontHaveAccount')}{' '}
                <Link href={`/${locale}/register`} className="text-blue-600 hover:underline font-medium">
                  {tCommon('signUp')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
