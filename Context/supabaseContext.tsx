'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '../lib/db/browser'
import type { Session, User } from '@supabase/supabase-js'

function normalizeTextKey(input: string) {
  return String(input ?? '')
    .replace(/[^\w]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
}

type SupabaseContextType = {
  db: typeof db
  user: User | null
  session: Session | null
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
  serverTextsMap?: Record<string, string>
  textsMap?: Record<string, string>
  serverImagesMap?: Record<string, string>
  imagesMap?: Record<string, string>
  draftTextsMap?: Record<string, string>
  draftImagesMap?: Record<string, File>
  setDraftText?: (textKey: string, text: string) => void
  clearDraftText?: (textKey: string) => void
  clearAllDraftTexts?: () => void
  setDraftImage?: (imageKey: string, file: File) => void
  clearDraftImage?: (imageKey: string) => void
  clearAllDraftImages?: () => void
  saveDraftTexts?: () => Promise<{ success: true; saved: number } | { success: false; error: string }>
  saveDraftImages?: () => Promise<{ success: true; saved: number } | { success: false; error: string }>
  refreshTexts?: () => Promise<void>
  refreshImages?: () => Promise<void>
  signInWithPassword: (email: string, password: string) => ReturnType<typeof db.auth.signInWithPassword>
  signOut: () => ReturnType<typeof db.auth.signOut>
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [serverTextsMap, setServerTextsMap] = useState<Record<string, string>>({})
  const [serverImagesMap, setServerImagesMap] = useState<Record<string, string>>({})
  const [draftTextsMap, setDraftTextsMap] = useState<Record<string, string>>({})
  const [draftImagesMap, setDraftImagesMap] = useState<Record<string, File>>({})

  const textsMap = { ...serverTextsMap, ...draftTextsMap }
  const imagesMap = { ...serverImagesMap }

  const setDraftText = (textKey: string, text: string) => {
    const normalizedKey = normalizeTextKey(textKey)
    setDraftTextsMap((prev) => ({ ...prev, [normalizedKey]: text }))
  }

  const clearDraftText = (textKey: string) => {
    const normalizedKey = normalizeTextKey(textKey)
    setDraftTextsMap((prev) => {
      if (!(normalizedKey in prev)) return prev
      const next = { ...prev }
      delete next[normalizedKey]
      return next
    })
  }

  const clearAllDraftTexts = () => {
    setDraftTextsMap({})
  }

  const setDraftImage = (imageKey: string, file: File) => {
    const normalizedKey = normalizeTextKey(imageKey)
    setDraftImagesMap((prev) => ({ ...prev, [normalizedKey]: file }))
  }

  const clearDraftImage = (imageKey: string) => {
    const normalizedKey = normalizeTextKey(imageKey)
    setDraftImagesMap((prev) => {
      if (!(normalizedKey in prev)) return prev
      const next = { ...prev }
      delete next[normalizedKey]
      return next
    })
  }

  const clearAllDraftImages = () => {
    setDraftImagesMap({})
  }

  const signInWithPassword = (email: string, password: string) =>
    db.auth.signInWithPassword({ email, password })

  const signOut = () => db.auth.signOut()

  // fetch page texts once and expose as a map keyed by `text_key`
  const fetchTexts = async () => {
    try {
      const res = await fetch('/api/texts', { cache: 'no-store' })
      if (!res.ok) return
      // API now returns a map keyed by normalized text_key -> text
      const data = await res.json()
      setServerTextsMap(data ?? {})
    } catch (e) {
      console.error('Failed to load page texts', e)
    }
  }

  const fetchImages = async () => {
    try {
      // 1) Prefer public URLs stored in pageImages (fast to read, long-lived)
      const { data: rowsRaw, error } = await db.from('pageImages').select('group_key,image_key,url')
      const rows: Array<{ group_key: string | null; image_key: string; url: string | null }> = Array.isArray(rowsRaw)
        ? (rowsRaw as Array<{ group_key: string | null; image_key: string; url: string | null }>)
        : []
      if (!error && rows.length > 0) {
        const dbMap: Record<string, string> = {}
        for (const row of rows) {
          const g = normalizeTextKey(row.group_key ?? '')
          const i = normalizeTextKey(row.image_key ?? '')
          const u = typeof row.url === 'string' ? row.url : ''
          if (!u) continue
          const key = g ? (i === 'main' ? g : `${g}_${i}`) : i
          if (key) dbMap[key] = u
        }
        if (Object.keys(dbMap).length > 0) {
          setServerImagesMap((prev) => ({ ...prev, ...dbMap }))
        }
      }

      // 2) Overlay with storage-derived URLs from /api/images (reflect latest uploads)
      const res = await fetch('/api/images', { cache: 'no-store' })
      if (!res.ok) return
      const storageMap = await res.json()
      setServerImagesMap((prev) => ({ ...prev, ...(storageMap ?? {}) }))
    } catch (e) {
      console.error('Failed to load page images', e)
    }
  }

  const saveDraftTexts = async () => {
    try {
      const drafts = draftTextsMap ?? {}
      const keys = Object.keys(drafts)
      if (keys.length === 0) return { success: true as const, saved: 0 }

      const res = await fetch('/api/texts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: drafts, published: true }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        const base = typeof data?.error === 'string' ? data.error : 'Failed to save'
        const extraParts = [data?.code, data?.details, data?.hint]
          .filter((v: unknown) => typeof v === 'string' && v.length > 0)
          .join(' | ')
        const message = extraParts ? `${base} (${extraParts})` : base
        return { success: false as const, error: message }
      }

      const saved = typeof data?.saved === 'number' ? data.saved : keys.length
      clearAllDraftTexts()
      await fetchTexts()
      return { success: true as const, saved }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      return { success: false as const, error: message }
    }
  }

  const saveDraftImages = async () => {
    try {
      const drafts = draftImagesMap ?? {}
      const entries = Object.entries(drafts)
      if (entries.length === 0) return { success: true as const, saved: 0 }

      // Upload one-by-one so we can reuse the existing /api/images endpoint (multipart/form-data)
      for (const [image_key, file] of entries) {
        const form = new FormData()
        // If the key encodes a group + pic index (e.g., services_background_pic_1), split into group_key + image_key
        const m = image_key.match(/^(.+?)_pic_(\d+)$/)
        if (m) {
          const group = m[1]
          const idx = parseInt(m[2], 10)
          if (group && Number.isFinite(idx) && idx >= 1 && idx <= 6) {
            form.set('group_key', group)
            form.set('image_key', `pic_${idx}`)
          } else {
            form.set('image_key', image_key)
          }
        } else {
          form.set('image_key', image_key)
        }
        form.set('file', file)

        const res = await fetch('/api/images', { method: 'POST', body: form })
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          const base = typeof data?.error === 'string' ? data.error : 'Failed to save image'
          return { success: false as const, error: base }
        }

        // Optimistically update the images map with the returned URL
        const normalizedKey = normalizeTextKey(image_key)
        const newUrl = typeof data?.tableUrl === 'string' ? data.tableUrl : (typeof data?.url === 'string' ? data.url : undefined)
        console.log("DASDASD" , newUrl)
        if (normalizedKey && newUrl) {
          setServerImagesMap((prev) => ({ ...prev, [normalizedKey]: newUrl }))
          console.log("DASDASD" , serverImagesMap)
        }
      }

      clearAllDraftImages()
      await fetchImages()
      return { success: true as const, saved: entries.length }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      return { success: false as const, error: message }
    }
  }

  const refreshAdmin = async (hasSession: boolean) => {
    if (!hasSession) {
      setIsAdmin(false)
      return
    }

    try {
      const res = await fetch('/api/admin/user', { cache: 'no-store' })
      setIsAdmin(res.ok)
    } catch {
      setIsAdmin(false)
    }
  }

  useEffect(() => {

    let isMounted = true

    ;(async () => {
      const { data } = await db.auth.getSession()
      if (!isMounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      await refreshAdmin(!!data.session)
      await fetchTexts()
      await fetchImages()
    })()

    const { data: sub } = db.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      refreshAdmin(!!newSession)
      // refresh texts after login/logout
      fetchTexts()
      fetchImages()
    })

    return () => {
      isMounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return (
    <SupabaseContext.Provider
      value={{
        db,
        user,
        session,
        isAdmin,
        setIsAdmin,
        serverTextsMap,
        textsMap,
        serverImagesMap,
        imagesMap,
        draftTextsMap,
        draftImagesMap,
        setDraftText,
        clearDraftText,
        clearAllDraftTexts,
        setDraftImage,
        clearDraftImage,
        clearAllDraftImages,
        saveDraftTexts,
        saveDraftImages,
        refreshTexts: fetchTexts,
        refreshImages: fetchImages,
        signInWithPassword,
        signOut,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const ctx = useContext(SupabaseContext)
  if (!ctx) throw new Error('useSupabase must be used within SupabaseProvider')
  return ctx
}