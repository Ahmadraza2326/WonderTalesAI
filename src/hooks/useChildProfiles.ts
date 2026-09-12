import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { childProfileService, getLocalChildProfiles } from '../services/childProfileService'
import type {
  ChildProfile,
  CreateChildProfileInput,
  UpdateChildProfileInput,
} from '../types/childProfile'

export interface UseChildProfilesResult {
  profiles: ChildProfile[]
  isLoading: boolean
  error: string | null
  selectedProfile: ChildProfile | null
  selectedProfileId: string | null
  selectProfile: (profileOrId: ChildProfile | string | null) => void
  refreshProfiles: () => Promise<void>
  createProfile: (input: CreateChildProfileInput) => Promise<{ data: ChildProfile | null; error: string | null }>
  updateProfile: (profileId: string, updates: UpdateChildProfileInput) => Promise<{ data: ChildProfile | null; error: string | null }>
  deleteProfile: (profileId: string) => Promise<{ success: boolean; error: string | null }>
}

export function useChildProfiles(): UseChildProfilesResult {
  const { user } = useAuth()
  const parentId = user?.id || 'guest'

  const [profiles, setProfiles] = useState<ChildProfile[]>(() =>
    getLocalChildProfiles(parentId)
  )
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const cached = getLocalChildProfiles(parentId)
    return cached.length === 0
  })
  const [error, setError] = useState<string | null>(null)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(() => {
    const cached = getLocalChildProfiles(parentId)
    return cached.length > 0 ? cached[0].id : null
  })
  const isMountedRef = useRef<boolean>(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchProfiles = useCallback(async () => {
    const currentParentId = user?.id || 'guest'

    const { data, error: fetchErr } = await childProfileService.getChildProfiles(currentParentId)

    if (isMountedRef.current) {
      if (fetchErr) {
        setError(fetchErr.message)
      } else {
        const list = data || []
        setProfiles(list)
        setSelectedProfileId((prevId) => {
          if (prevId && list.some((p) => p.id === prevId)) {
            return prevId
          }
          return list.length > 0 ? list[0].id : null
        })
      }
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchProfiles()
  }, [fetchProfiles])

  // Reactive listener to update profiles immediately in-memory and re-sync
  useEffect(() => {
    const handleProgressUpdated = (evt: Event) => {
      const customEvt = evt as CustomEvent<{ childId: string; xpAwarded?: number; starsAwarded?: number }>
      if (customEvt?.detail?.childId) {
        const { childId, xpAwarded = 0, starsAwarded = 0 } = customEvt.detail
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === childId
              ? {
                  ...p,
                  xp: (p.xp || 0) + xpAwarded,
                  stars: (p.stars || 0) + starsAwarded,
                }
              : p
          )
        )
      }
      void fetchProfiles()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('orbis:child_progress_updated', handleProgressUpdated)
      return () => {
        window.removeEventListener('orbis:child_progress_updated', handleProgressUpdated)
      }
    }
  }, [fetchProfiles])

  const selectProfile = useCallback(
    (profileOrId: ChildProfile | string | null) => {
      if (!profileOrId) {
        setSelectedProfileId(null)
        return
      }
      if (typeof profileOrId === 'string') {
        setSelectedProfileId(profileOrId)
      } else {
        setSelectedProfileId(profileOrId.id)
      }
    },
    []
  )

  const selectedProfile =
    profiles.find((p) => p.id === selectedProfileId) ?? null

  const createProfile = useCallback(
    async (input: CreateChildProfileInput): Promise<{ data: ChildProfile | null; error: string | null }> => {
      const parentId = user?.id || 'guest'

      const { data, error: createErr } = await childProfileService.createChildProfile(parentId, input)

      if (createErr || !data) {
        return { data: null, error: createErr?.message || 'Failed to create profile.' }
      }

      if (isMountedRef.current) {
        setProfiles((prev) => {
          const exists = prev.some((p) => p.id === data.id)
          return exists ? prev.map((p) => (p.id === data.id ? data : p)) : [...prev, data]
        })
        setSelectedProfileId(data.id)
      }

      return { data, error: null }
    },
    [user?.id]
  )

  const updateProfile = useCallback(
    async (
      profileId: string,
      updates: UpdateChildProfileInput
    ): Promise<{ data: ChildProfile | null; error: string | null }> => {
      const parentId = user?.id || 'guest'

      const { data, error: updateErr } = await childProfileService.updateChildProfile(
        profileId,
        parentId,
        updates
      )

      if (updateErr || !data) {
        return { data: null, error: updateErr?.message || 'Failed to update profile.' }
      }

      if (isMountedRef.current) {
        setProfiles((prev) => prev.map((p) => (p.id === profileId ? data : p)))
      }

      return { data, error: null }
    },
    [user?.id]
  )

  const deleteProfile = useCallback(
    async (profileId: string): Promise<{ success: boolean; error: string | null }> => {
      const parentId = user?.id || 'guest'

      const { error: deleteErr } = await childProfileService.deleteChildProfile(profileId, parentId)

      if (deleteErr) {
        return { success: false, error: deleteErr.message }
      }

      if (isMountedRef.current) {
        setProfiles((prev) => {
          const next = prev.filter((p) => p.id !== profileId)
          if (selectedProfileId === profileId) {
            setSelectedProfileId(next.length > 0 ? next[0].id : null)
          }
          return next
        })
      }

      return { success: true, error: null }
    },
    [user?.id, selectedProfileId]
  )

  return {
    profiles,
    isLoading,
    error,
    selectedProfile,
    selectedProfileId,
    selectProfile,
    refreshProfiles: fetchProfiles,
    createProfile,
    updateProfile,
    deleteProfile,
  }
}

