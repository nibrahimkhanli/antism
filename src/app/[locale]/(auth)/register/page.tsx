'use client'

import { useState, use } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { UserRole } from '@/lib/supabase/types'
import { Building2, Mic } from 'lucide-react'

export default function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = (searchParams.get('role') as UserRole) || null

  const [step, setStep] = useState<'role' | 'form'>(initialRole ? 'form' : 'role')
  const [role, setRole] = useState<UserRole | null>(initialRole)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })

  const handleRoleSelect = (r: UserRole) => {
    setRole(r)
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    setLoading(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName, role },
        emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        role,
        full_name: form.fullName,
        country: locale === 'ru' ? 'RU' : 'AZ',
        language: locale as 'az' | 'en' | 'ru',
      })

      router.push(`/${locale}/onboarding`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="text-2xl font-bold">antism</Link>
        </div>

        {step === 'role' ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('registerTitle')}</CardTitle>
              <CardDescription>{t('selectRole')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => handleRoleSelect('sponsor')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-slate-50 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{t('roleSponsor')}</div>
                  <div className="text-sm text-slate-500">{t('roleSponsorDesc')}</div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect('creator')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-slate-50 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <Mic className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{t('roleCreator')}</div>
                  <div className="text-sm text-slate-500">{t('roleCreatorDesc')}</div>
                </div>
              </button>
              <p className="text-center text-sm text-slate-500 pt-2">
                {t('alreadyHaveAccount')}{' '}
                <Link href={`/${locale}/login`} className="text-blue-600 hover:underline font-medium">
                  {tCommon('signIn')}
                </Link>
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('registerTitle')}</CardTitle>
              <CardDescription>
                {role === 'sponsor' ? t('roleSponsor') : t('roleCreator')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullName')}</Label>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                    required
                  />
                </div>
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
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? tCommon('loading') : tCommon('signUp')}
                </Button>
                <div className="flex gap-2 justify-between text-sm text-slate-500 pt-1">
                  <button
                    type="button"
                    onClick={() => setStep('role')}
                    className="hover:underline"
                  >
                    ← {tCommon('back')}
                  </button>
                  <span>
                    {t('alreadyHaveAccount')}{' '}
                    <Link href={`/${locale}/login`} className="text-blue-600 hover:underline font-medium">
                      {tCommon('signIn')}
                    </Link>
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
