'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

interface NavbarProps {
  profile?: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const dashboardPath = profile?.role === 'creator'
    ? '/creator/dashboard'
    : '/sponsor/dashboard'

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl tracking-tight">
            antism
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Kreatorlar
            </Link>
          </div>

          <div className="flex items-center gap-3">
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
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} variant="destructive">
                    Çıxış
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                  Daxil ol
                </Link>
                <Link href="/register" className={cn(buttonVariants({ size: 'sm' }))}>
                  Qeydiyyat
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
