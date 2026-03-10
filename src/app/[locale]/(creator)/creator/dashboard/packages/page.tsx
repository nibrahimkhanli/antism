'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { PackageCard } from '@/components/packages/PackageCard'
import { PackageForm } from '@/components/packages/PackageForm'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Package } from '@/lib/supabase/types'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export default function PackagesPage() {
  const t = useTranslations('packages')
  const tCommon = useTranslations('common')
  const locale = useLocale()
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Package | null>(null)
  const [saving, setSaving] = useState(false)
  const [creatorId, setCreatorId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from('profiles').select('id').eq('user_id', user.id).single()
      const { data: creator } = await supabase.from('creators').select('id').eq('profile_id', profile!.id).single()
      setCreatorId(creator!.id)

      const { data } = await supabase
        .from('packages')
        .select('*')
        .eq('creator_id', creator!.id)
        .order('created_at', { ascending: false })
      setPackages(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const handleCreate = async (data: Omit<Package, 'id' | 'creator_id' | 'created_at' | 'updated_at'>) => {
    if (!creatorId) return
    setSaving(true)
    const supabase = createClient()
    const { data: created, error } = await supabase
      .from('packages')
      .insert({ ...data, creator_id: creatorId })
      .select()
      .single()

    if (error) { toast.error(error.message) }
    else {
      setPackages(p => [created, ...p])
      setDialogOpen(false)
      toast.success('Paket yaradıldı')
    }
    setSaving(false)
  }

  const handleEdit = async (data: Omit<Package, 'id' | 'creator_id' | 'created_at' | 'updated_at'>) => {
    if (!editing) return
    setSaving(true)
    const supabase = createClient()
    const { data: updated, error } = await supabase
      .from('packages')
      .update(data)
      .eq('id', editing.id)
      .select()
      .single()

    if (error) { toast.error(error.message) }
    else {
      setPackages(p => p.map(x => x.id === editing.id ? updated : x))
      setEditing(null)
      setDialogOpen(false)
      toast.success(tCommon('success'))
    }
    setSaving(false)
  }

  const handleToggle = async (pkg: Package) => {
    const supabase = createClient()
    const newStatus = pkg.status === 'active' ? 'paused' : 'active'
    const { error } = await supabase.from('packages').update({ status: newStatus }).eq('id', pkg.id)
    if (!error) setPackages(p => p.map(x => x.id === pkg.id ? { ...x, status: newStatus } : x))
  }

  const handleDelete = async (pkg: Package) => {
    if (!confirm('Bu paketi silmək istədiyinizə əminsiniz?')) return
    const supabase = createClient()
    const { error } = await supabase.from('packages').delete().eq('id', pkg.id)
    if (!error) setPackages(p => p.filter(x => x.id !== pkg.id))
    else toast.error(error.message)
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <Button onClick={() => { setEditing(null); setDialogOpen(true) }} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('create')}
        </Button>
      </div>

      {loading ? (
        <div className="text-slate-400 text-center py-20">{tCommon('loading')}</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 mb-4">{t('noPackages')}</p>
          <Button onClick={() => setDialogOpen(true)}>{t('create')}</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map(pkg => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              mode="manage"
              onEdit={p => { setEditing(p); setDialogOpen(true) }}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={o => { setDialogOpen(o); if (!o) setEditing(null) }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? tCommon('edit') : t('create')}</DialogTitle>
          </DialogHeader>
          <PackageForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleEdit : handleCreate}
            onCancel={() => { setDialogOpen(false); setEditing(null) }}
            loading={saving}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
