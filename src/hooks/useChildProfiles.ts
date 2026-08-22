import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { childProfileService } from '../services/childProfileService'
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
  const [profiles, setProfiles] = useState<ChildProfile[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const isMountedRef = useRef<boolean>(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const fetchProfiles = useCallback(async () => {
    if (!user?.id) {
      if (isMountedRef.current) {
        setProfiles([])
        setIsLoading(false)
      }
      return
    }

    if (isMountedRef.current) {
      setIsLoading(true)
      setError(null)
    }

    const { data, error: fetchErr } = await childProfileService.getChildProfiles(user.id)

    if (isMountedRef.current) {
      if (fetchErr) {
        setError(fetchErr.message)
      } else {
        setProfiles(data || [])
      }
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchProfiles()
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
      if (!user?.id) {
        return { data: null, error: 'User is not signed in.' }
      }

      const { data, error: createErr } = await childProfileService.createChildProfile(user.id, input)

      if (createErr || !data) {
        return { data: null, error: createErr?.message || 'Failed to create profile.' }
      }

      if (isMountedRef.current) {
        setProfiles((prev) => [...prev, data])
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
      if (!user?.id) {
        return { data: null, error: 'User is not signed in.' }
      }

      const { data, error: updateErr } = await childProfileService.updateChildProfile(
        profileId,
        user.id,
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
      if (!user?.id) {
        return { success: false, error: 'User is not signed in.' }
      }

      const { error: deleteErr } = await childProfileService.deleteChildProfile(profileId, user.id)

      if (deleteErr) {
        return { success: false, error: deleteErr.message }
      }

      if (isMountedRef.current) {
        setProfiles((prev) => prev.filter((p) => p.id !== profileId))
        if (selectedProfileId === profileId) {
          setSelectedProfileId(null)
        }
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
