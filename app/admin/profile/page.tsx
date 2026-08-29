'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Mail,
  Save,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
  X,
} from 'lucide-react'

/* ============================================================
   TYPES
============================================================ */

type Role =
  | 'super_admin'
  | 'admin'
  | 'opportunity_manager'
  | 'content_manager'
  | 'operations_manager'
  | 'viewer'

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: Role
  avatar_url: string | null
}

/* ============================================================
   CONSTANTS
============================================================ */

/*
 * We intentionally use the existing "media" bucket.
 * Avatar files are isolated under:
 *
 * profiles/{userId}/avatars/{filename}
 *
 * Storage RLS must still restrict access to authenticated users
 * and preferably to their own folder.
 */
const STORAGE_BUCKET = 'media'
const AVATAR_FOLDER = 'avatars'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024

const ALLOWED_AVATAR_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

const MAX_FULL_NAME_LENGTH = 120

/* ============================================================
   HELPERS
============================================================ */

function getInitials(
  name: string | null,
  email: string | null
) {
  const source =
    name?.trim() ||
    email?.trim() ||
    'U'

  const parts = source
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return 'U'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function formatRole(role: Role) {
  return role.replace(/_/g, ' ')
}

function getExtensionFromMimeType(
  mimeType: string
) {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    default:
      return null
  }
}

function getStoragePathFromAvatarUrl(
  value: string | null,
  userId: string
) {
  if (!value) {
    return null
  }

  try {
    const parsed = new URL(value)
    const marker =
      `/storage/v1/object/public/${STORAGE_BUCKET}/`

    const markerIndex =
      parsed.pathname.indexOf(marker)

    if (markerIndex === -1) {
      return null
    }

    const relativePath =
      decodeURIComponent(
        parsed.pathname.slice(
          markerIndex + marker.length
        )
      )

    const expectedPrefix =
      `${userId}/${AVATAR_FOLDER}/`

    if (
      !relativePath.startsWith(
        expectedPrefix
      )
    ) {
      return null
    }

    return relativePath
  } catch {
    return null
  }
}

/* ============================================================
   SECTION
============================================================ */

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">

        {eyebrow && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A98B4F]">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}

      </div>

      <div className="p-5 sm:p-7">
        {children}
      </div>

    </section>
  )
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>

      <div className="mb-2 flex items-center justify-between gap-3">

        <label className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
          {label}
        </label>

        {hint && (
          <span className="text-[10px] text-slate-400">
            {hint}
          </span>
        )}

      </div>

      {children}

    </div>
  )
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">

      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_35px_rgba(10,12,11,0.16)]">

          <img
            src="/images/logo-bmi.png"
            alt="Barack Mining Investment"
            className="max-h-9 max-w-[46px] object-contain brightness-0 invert"
          />

        </div>

        <div className="mx-auto mt-5 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

        <p className="mt-4 text-sm font-semibold text-slate-900">
          Preparing your profile
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying your authenticated session...
        </p>

      </div>

    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     REF
  ---------------------------------------------------------- */

  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  /* ----------------------------------------------------------
     PROFILE
  ---------------------------------------------------------- */

  const [profile, setProfile] =
    useState<Profile | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [fullName, setFullName] =
    useState('')

  /* ----------------------------------------------------------
     AVATAR
  ---------------------------------------------------------- */

  const [avatarUrl, setAvatarUrl] =
    useState('')

  const [selectedAvatar, setSelectedAvatar] =
    useState<File | null>(null)

  const [avatarPreview, setAvatarPreview] =
    useState('')

  const [uploadingAvatar, setUploadingAvatar] =
    useState(false)

  /* ----------------------------------------------------------
     MESSAGES
  ---------------------------------------------------------- */

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState<string | null>(null)

  /* ==========================================================
     CLEAN OBJECT URL
  ========================================================== */

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        )
      }
    }
  }, [avatarPreview])

  /* ==========================================================
     LOAD PROFILE
  ========================================================== */

  const loadProfile =
    useCallback(
      async () => {
        setLoading(true)
        setError(null)

        try {
          const {
            data: {
              user,
            },
            error: authError,
          } =
            await supabase.auth.getUser()

          if (
            authError ||
            !user
          ) {
            router.replace(
              '/login'
            )
            return
          }

          const {
            data,
            error: profileError,
          } =
            await supabase
              .from('profiles')
              .select(
                'id, email, full_name, role, avatar_url'
              )
              .eq(
                'id',
                user.id
              )
              .maybeSingle()

          if (
            profileError ||
            !data
          ) {
            console.error(
              'Profile loading error:',
              profileError
            )

            throw new Error(
              'Unable to load your profile.'
            )
          }

          const typedProfile =
            data as Profile

          setProfile(
            typedProfile
          )

          setFullName(
            typedProfile.full_name ??
              ''
          )

          setAvatarUrl(
            typedProfile.avatar_url ??
              ''
          )
        } catch (loadError) {
          console.error(
            'Profile load failed:',
            loadError
          )

          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load your profile.'
          )
        } finally {
          setLoading(false)
        }
      },
      [router, supabase]
    )

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  /* ==========================================================
     AUTH STATE
  ========================================================== */

  useEffect(() => {
    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (
            event === 'SIGNED_OUT' ||
            !session?.user
          ) {
            router.replace(
              '/login'
            )
          }
        }
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  /* ==========================================================
     DERIVED
  ========================================================== */

  const initials =
    useMemo(
      () =>
        getInitials(
          fullName ||
            (profile?.full_name ??
              null),
          profile?.email ??
            null
        ),
      [
        fullName,
        profile,
      ]
    )

  const displayName =
    fullName.trim() ||
    profile?.full_name?.trim() ||
    'Administrator'

  const displayedAvatar =
    avatarPreview ||
    avatarUrl

  /* ==========================================================
     SELECT AVATAR
  ========================================================== */

  const handleAvatarSelection = (
    file: File
  ) => {
    setError(null)
    setSuccess(null)

    if (
      !ALLOWED_AVATAR_TYPES.includes(
        file.type as
          (typeof ALLOWED_AVATAR_TYPES)[number]
      )
    ) {
      setError(
        'Avatar must be a JPG, PNG or WebP image.'
      )

      return
    }

    if (
      file.size >
      MAX_AVATAR_SIZE
    ) {
      setError(
        'Avatar image must not exceed 5 MB.'
      )

      return
    }

    if (avatarPreview) {
      URL.revokeObjectURL(
        avatarPreview
      )
    }

    const previewUrl =
      URL.createObjectURL(
        file
      )

    setSelectedAvatar(
      file
    )

    setAvatarPreview(
      previewUrl
    )
  }

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ??
      null

    if (!file) {
      return
    }

    handleAvatarSelection(
      file
    )

    event.target.value = ''
  }

  /* ==========================================================
     REMOVE PENDING AVATAR
  ========================================================== */

  const handleRemoveAvatar =
    () => {
      setError(null)
      setSuccess(null)

      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        )
      }

      setSelectedAvatar(
        null
      )

      setAvatarPreview(
        ''
      )
    }

  /* ==========================================================
     UPLOAD AVATAR
  ========================================================== */

  const uploadAvatar = async (
    userId: string,
    file: File
  ) => {
    const extension =
      getExtensionFromMimeType(
        file.type
      )

    if (!extension) {
      throw new Error(
        'Unsupported avatar image format.'
      )
    }

    const filePath =
      `${userId}/${AVATAR_FOLDER}/avatar-${Date.now()}.${extension}`

    setUploadingAvatar(
      true
    )

    try {
      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            STORAGE_BUCKET
          )
          .upload(
            filePath,
            file,
            {
              cacheControl:
                '3600',
              contentType:
                file.type,
              upsert:
                false,
            }
          )

      if (
        uploadError
      ) {
        console.error(
          'Avatar upload error:',
          uploadError
        )

        throw new Error(
          uploadError.message ||
            'Unable to upload avatar.'
        )
      }

      const {
        data:
          publicUrlData,
      } =
        supabase.storage
          .from(
            STORAGE_BUCKET
          )
          .getPublicUrl(
            filePath
          )

      const publicUrl =
        publicUrlData
          .publicUrl

      if (!publicUrl) {
        throw new Error(
          'Unable to generate avatar URL.'
        )
      }

      return {
        path: filePath,
        url: publicUrl,
      }
    } finally {
      setUploadingAvatar(
        false
      )
    }
  }

  /* ==========================================================
     DELETE STORAGE AVATAR
  ========================================================== */

  const deleteStorageAvatar =
    async (
      url: string | null,
      userId: string
    ) => {
      const path =
        getStoragePathFromAvatarUrl(
          url,
          userId
        )

      if (!path) {
        return
      }

      const {
        error: deleteError,
      } =
        await supabase.storage
          .from(
            STORAGE_BUCKET
          )
          .remove([
            path,
          ])

      if (
        deleteError
      ) {
        console.error(
          'Avatar deletion error:',
          deleteError
        )
      }
    }

  /* ==========================================================
     SAVE PROFILE
  ========================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (
      saving ||
      uploadingAvatar ||
      !profile
    ) {
      return
    }

    setError(null)
    setSuccess(null)
    setSaving(true)

    let uploadedPath:
      | string
      | null = null

    try {
      const cleanName =
        fullName.trim()

      if (
        cleanName.length >
        MAX_FULL_NAME_LENGTH
      ) {
        throw new Error(
          'The full name is too long.'
        )
      }

      /* ------------------------------------------------------
         Session re-check
      ------------------------------------------------------ */

      const {
        data: {
          user,
        },
        error: authError,
      } =
        await supabase.auth.getUser()

      if (
        authError ||
        !user
      ) {
        router.replace(
          '/login'
        )
        return
      }

      if (
        user.id !==
        profile.id
      ) {
        router.replace(
          '/login'
        )
        return
      }

      /* ------------------------------------------------------
         Profile re-check
      ------------------------------------------------------ */

      const {
        data:
          currentProfile,
        error:
          profileError,
      } =
        await supabase
          .from('profiles')
          .select(
            'id, email, full_name, role, avatar_url'
          )
          .eq(
            'id',
            user.id
          )
          .maybeSingle()

      if (
        profileError ||
        !currentProfile
      ) {
        throw new Error(
          'Your profile is no longer available.'
        )
      }

      const oldAvatarUrl =
        currentProfile.avatar_url

      let nextAvatarUrl =
        oldAvatarUrl

      /* ------------------------------------------------------
         Upload new avatar
      ------------------------------------------------------ */

      if (
        selectedAvatar
      ) {
        const uploaded =
          await uploadAvatar(
            user.id,
            selectedAvatar
          )

        uploadedPath =
          uploaded.path

        nextAvatarUrl =
          uploaded.url
      }

      /* ------------------------------------------------------
         Update own profile
      ------------------------------------------------------ */

      const {
        data:
          updatedProfile,
        error:
          updateError,
      } =
        await supabase
          .from(
            'profiles'
          )
          .update({
            full_name:
              cleanName ||
              null,
            avatar_url:
              nextAvatarUrl ||
              null,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            'id',
            user.id
          )
          .select(
            'id, email, full_name, role, avatar_url'
          )
          .single()

      if (
        updateError
      ) {
        console.error(
          'Profile update error:',
          updateError
        )

        if (
          uploadedPath
        ) {
          await supabase.storage
            .from(
              STORAGE_BUCKET
            )
            .remove([
              uploadedPath,
            ])
        }

        throw new Error(
          updateError.message ||
            'Unable to update your profile.'
        )
      }

      /* ------------------------------------------------------
         Delete old avatar only after successful DB update
      ------------------------------------------------------ */

      if (
        selectedAvatar &&
        oldAvatarUrl &&
        oldAvatarUrl !==
          nextAvatarUrl
      ) {
        await deleteStorageAvatar(
          oldAvatarUrl,
          user.id
        )
      }

      const typedUpdatedProfile =
        updatedProfile as Profile

      setProfile(
        typedUpdatedProfile
      )

      setFullName(
        typedUpdatedProfile.full_name ??
          ''
      )

      setAvatarUrl(
        typedUpdatedProfile.avatar_url ??
          ''
      )

      if (avatarPreview) {
        URL.revokeObjectURL(
          avatarPreview
        )
      }

      setAvatarPreview(
        ''
      )

      setSelectedAvatar(
        null
      )

      setSuccess(
        'Your profile has been updated successfully.'
      )
    } catch (saveError) {
      console.error(
        'Profile update failed:',
        saveError
      )

      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update your profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  /* ==========================================================
     REMOVE CURRENT AVATAR
  ========================================================== */

  const handleRemoveCurrentAvatar =
    async () => {
      if (
        !profile ||
        saving ||
        uploadingAvatar
      ) {
        return
      }

      const confirmed =
        window.confirm(
          'Remove your current profile photo?'
        )

      if (!confirmed) {
        return
      }

      setError(null)
      setSuccess(null)
      setSaving(true)

      try {
        const {
          data: {
            user,
          },
          error: authError,
        } =
          await supabase.auth.getUser()

        if (
          authError ||
          !user ||
          user.id !==
            profile.id
        ) {
          router.replace(
            '/login'
          )
          return
        }

        const {
          data:
            currentProfile,
          error:
            profileError,
        } =
          await supabase
            .from(
              'profiles'
            )
            .select(
              'id, avatar_url'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          profileError ||
          !currentProfile
        ) {
          throw new Error(
            'Unable to verify your current profile.'
          )
        }

        const oldAvatarUrl =
          currentProfile.avatar_url

        const {
          error:
            updateError,
        } =
          await supabase
            .from(
              'profiles'
            )
            .update({
              avatar_url:
                null,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              user.id
            )

        if (
          updateError
        ) {
          throw new Error(
            updateError.message ||
              'Unable to remove your avatar.'
          )
        }

        await deleteStorageAvatar(
          oldAvatarUrl,
          user.id
        )

        setAvatarUrl(
          ''
        )

        setProfile(
          (current) =>
            current
              ? {
                  ...current,
                  avatar_url:
                    null,
                }
              : current
        )

        setSuccess(
          'Your profile photo has been removed.'
        )
      } catch (removeError) {
        console.error(
          'Avatar removal failed:',
          removeError
        )

        setError(
          removeError instanceof Error
            ? removeError.message
            : 'Unable to remove your avatar.'
        )
      } finally {
        setSaving(false)
      }
    }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <LoadingState />
    )
  }

  /* ==========================================================
     PROFILE ERROR
  ========================================================== */

  if (!profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert size={23} />
          </div>

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-red-600">
            Account profile
          </p>

          <h2 className="mt-2 text-lg font-semibold text-slate-950">
            Profile unavailable
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ??
              'Your profile could not be loaded.'}
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace(
                '/admin'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(15,23,42,0.15)] transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </button>

        </div>

      </div>
    )
  }

  /* ==========================================================
     MAIN
  ========================================================== */

  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin'
              )
            }
            className="group inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >

            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-slate-900 group-hover:text-white">
              <ArrowLeft size={13} />
            </span>

            Back to dashboard

          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-medium text-slate-400">
            Administration
          </span>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-semibold text-slate-700">
            My Profile
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div className="flex items-start gap-4">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_30px_rgba(10,12,11,0.13)]">

              <img
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                className="max-h-9 max-w-[46px] object-contain brightness-0 invert"
              />

            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                  Profile
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected account
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                My Profile
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your personal information and profile photo inside the Barack Mining Investment administration workspace.
              </p>

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Current access
            </p>

            <div className="mt-2 flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-[10px] font-bold text-[#D0A765]">

                {displayedAvatar ? (
                  <img
                    src={displayedAvatar}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}

              </div>

              <div className="min-w-0">

                <p className="truncate text-xs font-semibold text-slate-900">
                  {displayName}
                </p>

                <p className="truncate text-[10px] capitalize text-slate-400">
                  {formatRole(
                    profile.role
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <ShieldAlert size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Profile update failed
            </p>

            <p className="mt-1 whitespace-pre-line text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
            aria-label="Dismiss error"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
            <CheckCircle2 size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-emerald-800">
              Profile updated
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              {success}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSuccess(null)
            }
            className="rounded-lg p-1 text-emerald-400 transition hover:bg-emerald-100 hover:text-emerald-700"
            aria-label="Dismiss success"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">

        {/* ====================================================
            LEFT
        ==================================================== */}

        <div className="space-y-6">

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-6"
          >

            {/* ==================================================
                IDENTITY
            ================================================== */}

            <Section
              eyebrow="Identity"
              title="Personal information"
              description="Update the information displayed inside the administration workspace."
            >

              <div className="grid gap-5">

                <Field
                  label="Full name"
                  hint={`${fullName.length}/${MAX_FULL_NAME_LENGTH}`}
                >

                  <div className="relative">

                    <UserRound
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={
                        fullName
                      }
                      onChange={(
                        event
                      ) =>
                        setFullName(
                          event.target
                            .value
                        )
                      }
                      maxLength={
                        MAX_FULL_NAME_LENGTH
                      }
                      autoComplete="name"
                      placeholder="Your full name"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                    />

                  </div>

                </Field>

                <Field
                  label="Email address"
                  hint="Authenticated account"
                >

                  <div className="relative">

                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={
                        profile.email
                      }
                      readOnly
                      className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-500 outline-none"
                    />

                  </div>

                </Field>

              </div>

            </Section>

            {/* ==================================================
                AVATAR
            ================================================== */}

            <Section
              eyebrow="Profile photo"
              title="Avatar"
              description="Upload the photo used to represent your account throughout the protected workspace."
            >

              <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-center">

                <div className="flex justify-center lg:justify-start">

                  <div className="relative">

                    <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[36px] border border-slate-200 bg-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.10)]">

                      {displayedAvatar ? (
                        <img
                          src={
                            displayedAvatar
                          }
                          alt={
                            displayName
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#0A0C0B] text-4xl font-semibold text-[#D0A765]">
                          {initials}
                        </div>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        saving ||
                        uploadingAvatar
                      }
                      className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Upload profile photo"
                    >
                      <Camera
                        size={17}
                      />
                    </button>

                  </div>

                </div>

                <div className="space-y-4">

                  <div>

                    <p className="text-sm font-semibold text-slate-900">
                      Profile image
                    </p>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                      Use a professional JPG, PNG or WebP image. The maximum file size is 5 MB.
                    </p>

                  </div>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleFileInputChange
                    }
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        saving ||
                        uploadingAvatar
                      }
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                      {uploadingAvatar ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          {displayedAvatar
                            ? 'Change photo'
                            : 'Upload photo'}
                        </>
                      )}

                    </button>

                    {selectedAvatar && (
                      <button
                        type="button"
                        onClick={
                          handleRemoveAvatar
                        }
                        disabled={
                          saving ||
                          uploadingAvatar
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2
                          size={14}
                        />
                        Cancel selection
                      </button>
                    )}

                    {!selectedAvatar &&
                      avatarUrl && (
                        <button
                          type="button"
                          onClick={
                            handleRemoveCurrentAvatar
                          }
                          disabled={
                            saving ||
                            uploadingAvatar
                          }
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={14}
                          />
                          Remove photo
                        </button>
                      )}

                  </div>

                  {selectedAvatar && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">

                      <p className="text-xs font-semibold text-amber-800">
                        New photo selected
                      </p>

                      <p className="mt-1 break-all text-[10px] leading-5 text-amber-700/80">
                        {selectedAvatar.name}
                      </p>

                      <p className="mt-1 text-[10px] text-amber-700/70">
                        The new photo will be uploaded when you save your profile.
                      </p>

                    </div>
                  )}

                </div>

              </div>

            </Section>

            {/* ==================================================
                ACCESS
            ================================================== */}

            <Section
              eyebrow="Access"
              title="Account role"
              description="Your access level is managed by the administration system and cannot be changed from your personal profile."
            >

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-[#D0A765]">
                    <ShieldCheck
                      size={19}
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-semibold capitalize text-slate-800">
                      {formatRole(
                        profile.role
                      )}
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-500">
                      Role permissions are enforced independently by the authenticated workspace and Supabase access policies.
                    </p>

                  </div>

                </div>

              </div>

            </Section>

            {/* ==================================================
                ACTION BAR
            ================================================== */}

            <div className="sticky bottom-4 z-20">

              <div className="flex flex-col justify-between gap-3 rounded-[22px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.13)] backdrop-blur-xl sm:flex-row sm:items-center">

                <div className="flex items-center gap-3 px-2">

                  <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex">
                    <Save
                      size={15}
                    />
                  </div>

                  <div>

                    <p className="text-xs font-semibold text-slate-800">
                      {saving ||
                      uploadingAvatar
                        ? 'Saving profile...'
                        : 'Profile ready'}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      Changes apply only to your own account.
                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    type="button"
                    disabled={
                      saving ||
                      uploadingAvatar
                    }
                    onClick={() =>
                      router.push(
                        '/admin'
                      )
                    }
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    <ArrowLeft
                      size={14}
                    />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      uploadingAvatar
                    }
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >

                    {saving ||
                    uploadingAvatar ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save
                          size={15}
                        />
                        Save Changes
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>

          </form>

        </div>

        {/* ====================================================
            RIGHT
        ==================================================== */}

        <aside className="space-y-6">

          <Section
            eyebrow="Preview"
            title="Profile identity"
            description="This is how your account identity is represented inside the workspace."
          >

            <div className="flex flex-col items-center text-center">

              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[32px] border border-slate-200 bg-slate-100 shadow-[0_16px_40px_rgba(15,23,42,0.10)]">

                {displayedAvatar ? (
                  <img
                    src={
                      displayedAvatar
                    }
                    alt={
                      displayName
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#0A0C0B] text-3xl font-semibold text-[#D0A765]">
                    {initials}
                  </div>
                )}

              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-950">
                {displayName}
              </h3>

              <p className="mt-1 max-w-full truncate text-xs text-slate-400">
                {profile.email}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#F3EFE7] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#94713F]">
                {formatRole(
                  profile.role
                )}
              </span>

            </div>

          </Section>

          <Section
            eyebrow="Security"
            title="Protected account"
          >

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                  <ShieldCheck
                    size={17}
                  />
                </div>

                <div>

                  <p className="text-xs font-semibold text-emerald-800">
                    Authenticated profile
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-emerald-700/75">
                    Profile changes are submitted through the current authenticated Supabase session and target only your own profile.
                  </p>

                </div>

              </div>

            </div>

          </Section>

          <Section
            eyebrow="Photo policy"
            title="Upload requirements"
          >

            <div className="space-y-3">

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Camera
                    size={14}
                  />
                </div>

                <div>

                  <p className="text-xs font-semibold text-slate-800">
                    Accepted formats
                  </p>

                  <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
                    JPG, PNG and WebP.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Upload
                    size={14}
                  />
                </div>

                <div>

                  <p className="text-xs font-semibold text-slate-800">
                    Maximum size
                  </p>

                  <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
                    5 MB per profile image.
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <ShieldCheck
                    size={14}
                  />
                </div>

                <div>

                  <p className="text-xs font-semibold text-slate-800">
                    Protected ownership
                  </p>

                  <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
                    Avatar files are stored under your authenticated user identifier.
                  </p>

                </div>

              </div>

            </div>

          </Section>

        </aside>

      </div>

    </div>
  )
}