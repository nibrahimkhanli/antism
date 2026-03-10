'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Profile } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Package, Handshake, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreatorSidebarProps {
  profile: Profile
  locale: string
}

export function CreatorSidebar({ profile, locale }: CreatorSidebarProps) {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const pathname = usePathname()
  const router = useRouter()

  const base = `/${locale}/creator/dashboard`

  const links = [
    { href: base, label: t('dashboard'), icon: LayoutDashboard },
    { href: `${base}/packages`, label: t('packages'), icon: Package },
    { href: `${base}/deals`, label: t('deals'), icon: Handshake },
    { href: `${base}/profile`, label: t('profile'), icon: User },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}`)
  }

  return (
    <aside className="w-64 bg-white border-r flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href={`/${locale}`} className="font-bold text-lg">antism</Link>
      </div>

      {/* Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile.avatar_url ?? ''} />
            <AvatarFallback>{profile.full_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">{profile.full_name}</div>
            <div className="text-xs text-slate-500">Kreator</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          {tCommon('signOut')}
        </button>
      </div>
    </aside>
  )
}
