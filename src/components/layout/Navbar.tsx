'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Globe, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

const localeNames: Record<string, string> = {
  az: 'AZ',
  en: 'EN',
  ru: 'RU',
}

interface NavbarProps {
  profile?: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
    router.refresh()
  }

  const dashboardPath = profile?.role === 'creator'
    ? `/${locale}/creator/dashboard`
    : `/${locale}/sponsor/dashboard`

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="font-bold text-xl tracking-tight">
            antism
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/browse`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('nav.browse')}
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Locale switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Globe className="h-4 w-4" />
                  {localeNames[locale]}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {['az', 'en', 'ru'].map((l) => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={locale === l ? 'font-semibold' : ''}
                  >
                    {l === 'az' ? 'Azərbaycan' : l === 'en' ? 'English' : 'Русский'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile.avatar_url ?? ''} />
                      <AvatarFallback className="text-xs">
                        {profile.full_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem render={<Link href={dashboardPath} />}>
                    {t('nav.dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    {t('common.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                >
                  {t('common.signIn')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className={cn(buttonVariants({ size: 'sm' }))}
                >
                  {t('common.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
