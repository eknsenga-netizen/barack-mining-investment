'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
  created_at: string
  updated_at: string
}

/* ============================================================
   CONSTANTS
============================================================ */

const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  opportunity_manager: 'Opportunity Manager',
  content_manager: 'Content Manager',
  operations_manager: 'Operations Manager',
  viewer: 'Viewer',
}

const ROLE_OPTIONS: {
  value: Role
  label: string
}[] = [
  {
    value: 'super_admin',
    label: 'Super Admin',
  },
  {
    value: 'admin',
    label: 'Administrator',
  },
  {
    value: 'opportunity_manager',
    label: 'Opportunity Manager',
  },
  {
    value: 'content_manager',
    label: 'Content Manager',
  },
  {
    value: 'operations_manager',
    label: 'Operations Manager',
  },
  {
    value: 'viewer',
    label: 'Viewer',
  },
]

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
]

/* ============================================================
   HELPERS
============================================================ */

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(date)
}

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(date)
}

function getInitials(
  name: string | null,
  email: string | null
) {
  const source =
    name?.trim() ||
    email?.trim() ||
    'BMI'

  const parts = source
    .split(/\s+/)
    .filter(Boolean)

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function getRoleBadgeClass(
  role: Role
) {
  switch (role) {
    case 'super_admin':
      return 'bg-red-50 text-red-700 ring-red-600/10'

    case 'admin':
      return 'bg-amber-50 text-amber-700 ring-amber-600/10'

    case 'content_manager':
      return 'bg-blue-50 text-blue-700 ring-blue-600/10'

    case 'opportunity_manager':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'

    case 'operations_manager':
      return 'bg-purple-50 text-purple-700 ring-purple-600/10'

    case 'viewer':
      return 'bg-slate-100 text-slate-600 ring-slate-500/10'

    default:
      return 'bg-slate-50 text-slate-600 ring-slate-500/10'
  }
}

/* ============================================================
   FILTER BADGE
============================================================ */

function FilterBadge({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 shadow-sm">

      <span className="max-w-[260px] truncate">
        {label}
      </span>

      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label={`Remove ${label}`}
      >
        <X size={12} />
      </button>

    </span>
  )
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState({
  message = 'Loading users...',
  submessage = 'Verifying access and loading user directory...',
}: {
  message?: string
  submessage?: string
}) {
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
          {message}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {submessage}
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  filtered,
  onInvite,
  onClear,
}: {
  filtered: boolean
  onInvite: () => void
  onClear: () => void
}) {
  return (
    <div className="rounded-[26px] border border-slate-200/80 bg-white px-6 py-16 text-center shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Users size={23} />
      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-950">
        {filtered
          ? 'No matching users'
          : 'No users found'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? 'No user matches the current search or role filter.'
          : 'There are currently no user profiles available in the administration workspace.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

        {filtered && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Clear filters
          </button>
        )}

        {!filtered && (
          <button
            type="button"
            onClick={onInvite}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
          >
            <Plus size={15} />
            Invite User
          </button>
        )}

      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function UsersPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     AUTH
  ---------------------------------------------------------- */

  const [profile, setProfile] =
    useState<Profile | null>(
      null
    )

  const [authorized, setAuthorized] =
    useState(false)

  const [checkingAccess, setCheckingAccess] =
    useState(true)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [users, setUsers] =
    useState<Profile[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  /* ----------------------------------------------------------
     FEEDBACK
  ---------------------------------------------------------- */

  const [error, setError] =
    useState<string | null>(
      null
    )

  const [success, setSuccess] =
    useState<string | null>(
      null
    )

  /* ----------------------------------------------------------
     FILTERS
  ---------------------------------------------------------- */

  const [search, setSearch] =
    useState('')

  const [roleFilter, setRoleFilter] =
    useState<string>('all')

  /* ==========================================================
     ACCESS CHECK
  ========================================================== */

  const verifyAccess =
    useCallback(
      async () => {
        setCheckingAccess(true)

        try {
          const {
            data: {
              user,
            },
          } =
            await supabase.auth.getUser()

          if (!user) {
            router.replace(
              '/login'
            )
            return
          }

          const {
            data: currentProfile,
            error: profileError,
          } =
            await supabase
              .from('profiles')
              .select(
                'id, email, full_name, role, avatar_url, created_at, updated_at'
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
            console.error(
              'Profile access error:',
              profileError
            )

            router.replace(
              '/login'
            )
            return
          }

          const typedProfile =
            currentProfile as Profile

          setProfile(
            typedProfile
          )

          setAuthorized(
            AUTHORIZED_ROLES.includes(
              typedProfile.role
            )
          )
        } catch (
          accessError
        ) {
          console.error(
            'Access verification error:',
            accessError
          )

          router.replace(
            '/login'
          )
        } finally {
          setCheckingAccess(
            false
          )
        }
      },
      [
        router,
        supabase,
      ]
    )

  useEffect(() => {
    verifyAccess()
  }, [
    verifyAccess,
  ])

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
            event ===
              'SIGNED_OUT' ||
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
  }, [
    router,
    supabase,
  ])

  /* ==========================================================
     LOAD USERS
  ========================================================== */

  const loadUsers =
    useCallback(
      async (
        isRefresh = false
      ) => {
        if (!authorized) {
          return
        }

        if (isRefresh) {
          setRefreshing(
            true
          )
        } else {
          setLoading(
            true
          )
        }

        setError(
          null
        )

        try {
          const {
            data,
            error: profilesError,
          } =
            await supabase
              .from('profiles')
              .select(
                'id, email, full_name, role, avatar_url, created_at, updated_at'
              )
              .order(
                'created_at',
                {
                  ascending: false,
                }
              )

          if (
            profilesError
          ) {
            console.error(
              'Users query error:',
              profilesError
            )

            throw new Error(
              'Unable to load the user directory.'
            )
          }

          setUsers(
            (data as Profile[]) ??
              []
          )
        } catch (
          loadError
        ) {
          console.error(
            'Users loading failed:',
            loadError
          )

          setUsers(
            []
          )

          setError(
            loadError instanceof
            Error
              ? loadError.message
              : 'Unable to load users.'
          )
        } finally {
          setLoading(
            false
          )

          setRefreshing(
            false
          )
        }
      },
      [
        authorized,
        supabase,
      ]
    )

  useEffect(() => {
    if (authorized) {
      loadUsers()
    }
  }, [
    authorized,
    loadUsers,
  ])

  /* ==========================================================
     FILTERING
  ========================================================== */

  const filteredUsers =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase()

        return users.filter(
          (user) => {
            const matchesRole =
              roleFilter ===
                'all' ||
              user.role ===
                roleFilter

            const matchesSearch =
              !term ||
              user.email
                .toLowerCase()
                .includes(
                  term
                ) ||
              (
                user.full_name ??
                ''
              )
                .toLowerCase()
                .includes(
                  term
                )

            return (
              matchesRole &&
              matchesSearch
            )
          }
        )
      },
      [
        users,
        search,
        roleFilter,
      ]
    )

  const hasActiveFilters =
    roleFilter !==
      'all' ||
    search.trim() !==
      ''

  const clearFilters =
    () => {
      setRoleFilter(
        'all'
      )

      setSearch(
        ''
      )
    }

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts =
    useMemo(
      () => ({
        total:
          users.length,

        admins:
          users.filter(
            (user) =>
              user.role ===
                'admin' ||
              user.role ===
                'super_admin'
          ).length,

        viewers:
          users.filter(
            (user) =>
              user.role ===
              'viewer'
          ).length,

        managers:
          users.filter(
            (user) =>
              user.role ===
                'opportunity_manager' ||
              user.role ===
                'content_manager' ||
              user.role ===
                'operations_manager'
          ).length,
      }),
      [
        users,
      ]
    )

  /* ==========================================================
     ROLE UPDATE
  ========================================================== */

  const handleUpdateRole =
    async (
      userId: string,
      newRole: Role
    ) => {
      const target =
        users.find(
          (user) =>
            user.id ===
            userId
        )

      if (!target) {
        return
      }

      if (
        target.id ===
        profile?.id
      ) {
        setError(
          'You cannot change your own role from this workspace.'
        )
        return
      }

      if (
        target.role ===
        newRole
      ) {
        return
      }

      const confirmed =
        window.confirm(
          `Change "${target.email}" to "${ROLE_LABELS[newRole]}"?`
        )

      if (!confirmed) {
        return
      }

      setError(
        null
      )

      setSuccess(
        null
      )

      try {
        /* ------------------------------------------------------
           Re-check session
        ------------------------------------------------------ */

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace(
            '/login'
          )
          return
        }

        /* ------------------------------------------------------
           Re-check current actor
        ------------------------------------------------------ */

        const {
          data: actorProfile,
          error: actorError,
        } =
          await supabase
            .from('profiles')
            .select(
              'role'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          actorError ||
          !actorProfile ||
          !AUTHORIZED_ROLES.includes(
            actorProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is no longer authorized to manage users.'
          )
        }

        /* ------------------------------------------------------
           Mutation
           RLS remains the final enforcement layer.
        ------------------------------------------------------ */

        const {
          error: updateError,
        } =
          await supabase
            .from('profiles')
            .update({
              role:
                newRole,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              userId
            )

        if (
          updateError
        ) {
          console.error(
            'Role update error:',
            updateError
          )

          throw new Error(
            updateError.message ||
              'Unable to update the user role.'
          )
        }

        setUsers(
          (
            current
          ) =>
            current.map(
              (item) =>
                item.id ===
                userId
                  ? {
                      ...item,
                      role: newRole,
                      updated_at:
                        new Date().toISOString(),
                    }
                  : item
            )
        )

        setSuccess(
          `Role updated successfully for ${target.email}.`
        )
      } catch (
        updateError
      ) {
        console.error(
          'User role update failed:',
          updateError
        )

        setError(
          updateError instanceof
          Error
            ? updateError.message
            : 'Unable to update user role.'
        )
      }
    }

  /* ==========================================================
     DELETE PROFILE
  ========================================================== */

  const handleDeleteUser =
    async (
      userId: string
    ) => {
      const target =
        users.find(
          (user) =>
            user.id ===
            userId
        )

      if (!target) {
        return
      }

      if (
        target.id ===
        profile?.id
      ) {
        setError(
          'You cannot delete your own account from this workspace.'
        )
        return
      }

      const confirmed =
        window.confirm(
          `Delete the profile for "${target.email}"?\n\nThis removes the profile record. It does not delete the Supabase Auth user.`
        )

      if (!confirmed) {
        return
      }

      setError(
        null
      )

      setSuccess(
        null
      )

      try {
        /* ------------------------------------------------------
           Re-check session
        ------------------------------------------------------ */

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace(
            '/login'
          )
          return
        }

        /* ------------------------------------------------------
           Re-check actor
        ------------------------------------------------------ */

        const {
          data: actorProfile,
          error: actorError,
        } =
          await supabase
            .from('profiles')
            .select(
              'role'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          actorError ||
          !actorProfile ||
          !AUTHORIZED_ROLES.includes(
            actorProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is no longer authorized to manage users.'
          )
        }

        /* ------------------------------------------------------
           Delete profile
        ------------------------------------------------------ */

        const {
          error: deleteError,
        } =
          await supabase
            .from('profiles')
            .delete()
            .eq(
              'id',
              userId
            )

        if (
          deleteError
        ) {
          console.error(
            'Profile deletion error:',
            deleteError
          )

          throw new Error(
            deleteError.message ||
              'Unable to remove the user profile.'
          )
        }

        setUsers(
          (
            current
          ) =>
            current.filter(
              (item) =>
                item.id !==
                userId
            )
        )

        setSuccess(
          `Profile removed for ${target.email}.`
        )
      } catch (
        deleteError
      ) {
        console.error(
          'User deletion failed:',
          deleteError
        )

        setError(
          deleteError instanceof
          Error
            ? deleteError.message
            : 'Unable to remove user.'
        )
      }
    }

  /* ==========================================================
     INVITE
  ========================================================== */

  const handleInvite =
    () => {
      router.push(
        '/admin/users/invite'
      )
    }

  /* ==========================================================
     AUTH LOADING
  ========================================================== */

  if (
    checkingAccess
  ) {
    return (
      <LoadingState
        message="Preparing secure user workspace"
        submessage="Verifying your administration privileges..."
      />
    )
  }

  /* ==========================================================
     ACCESS DENIED
  ========================================================== */

  if (
    !authorized
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert size={23} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-950">
            Access restricted
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your current role does not have permission to manage users and administration roles.
          </p>

          {profile?.email && (
            <p className="mt-3 text-xs text-slate-400">
              Signed in as {profile.email}
            </p>
          )}

          <button
            type="button"
            onClick={() =>
              router.replace(
                '/admin'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
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
    <div className="mx-auto max-w-[1280px] space-y-6 pb-10">

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
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Back
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
            Users
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

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
                  Administration
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                User Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage administration profiles, workspace roles and access-related profile records.
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadUsers(true)
              }
              disabled={
                refreshing
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={
                handleInvite
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Invite User
            </button>

          </div>
        </div>
      </section>

      {/* ======================================================
          FEEDBACK
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <CircleAlert size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Operation failed
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError(
                null
              )
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
              Operation completed
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              {success}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSuccess(
                null
              )
            }
            className="rounded-lg p-1 text-emerald-400 transition hover:bg-emerald-100 hover:text-emerald-700"
            aria-label="Dismiss success"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Total
            </span>

            <Users
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.total}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Registered profiles
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Administrators
            </span>

            <ShieldCheck
              size={16}
              className="text-amber-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.admins}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Super Admin + Admin
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Managers
            </span>

            <UserRound
              size={16}
              className="text-emerald-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.managers}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Operational and content roles
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Viewers
            </span>

            <ArrowRight
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.viewers}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Read-only profiles
          </p>

        </div>

      </section>

      {/* ======================================================
          SEARCH / FILTERS
      ====================================================== */}

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="relative flex-1">

            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search by name or email..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            <div className="relative">

              <select
                value={
                  roleFilter
                }
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value
                  )
                }
                className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              >
                <option value="all">
                  All roles
                </option>

                {ROLE_OPTIONS.map(
                  (
                    option
                  ) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  )
                )}

              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={14} />
                Clear
              </button>
            )}

          </div>

        </div>

      </section>

      {/* ======================================================
          ACTIVE FILTERS
      ====================================================== */}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">

          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Active filters
          </span>

          {roleFilter !==
            'all' && (
            <FilterBadge
              label={`Role: ${
                ROLE_LABELS[
                  roleFilter as Role
                ]
              }`}
              onRemove={() =>
                setRoleFilter(
                  'all'
                )
              }
            />
          )}

          {search.trim() && (
            <FilterBadge
              label={`Search: "${search.trim()}"`}
              onRemove={() =>
                setSearch(
                  ''
                )
              }
            />
          )}

        </div>
      )}

      {/* ======================================================
          RESULT HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm font-semibold text-slate-900">
            {filteredUsers.length}{' '}
            {filteredUsers.length ===
            1
              ? 'user'
              : 'users'}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {hasActiveFilters
              ? 'Matching the current criteria'
              : 'Complete administration directory'}
          </p>

        </div>

        {filteredUsers.length >
          0 && (
          <p className="text-xs text-slate-400">
            Showing{' '}
            <span className="font-semibold text-slate-600">
              {filteredUsers.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-600">
              {users.length}
            </span>
          </p>
        )}

      </div>

      {/* ======================================================
          LOADING / CONTENT
      ====================================================== */}

      {loading ? (
        <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

          <div className="hidden md:block">

            <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-4">

              <div className="grid grid-cols-5 gap-4">

                {Array.from({
                  length: 5,
                }).map(
                  (_, index) => (
                    <div
                      key={
                        index
                      }
                      className="h-3 animate-pulse rounded bg-slate-200/70"
                    />
                  )
                )}

              </div>
            </div>

            <div className="divide-y divide-slate-100">

              {Array.from({
                length: 6,
              }).map(
                (_, index) => (
                  <div
                    key={
                      index
                    }
                    className="grid grid-cols-5 gap-4 px-5 py-5"
                  >

                    {Array.from({
                      length: 5,
                    }).map(
                      (
                        __,
                        cellIndex
                      ) => (
                        <div
                          key={
                            cellIndex
                          }
                          className="h-4 animate-pulse rounded bg-slate-100"
                        />
                      )
                    )}

                  </div>
                )
              )}

            </div>
          </div>

          <div className="space-y-3 p-4 md:hidden">

            {Array.from({
              length: 4,
            }).map(
              (_, index) => (
                <div
                  key={
                    index
                  }
                  className="h-28 animate-pulse rounded-2xl bg-slate-100"
                />
              )
            )}

          </div>

        </div>
      ) : filteredUsers.length ===
        0 ? (
        <EmptyState
          filtered={
            hasActiveFilters
          }
          onInvite={
            handleInvite
          }
          onClear={
            clearFilters
          }
        />
      ) : (
        <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

          <div className="overflow-x-auto">

            <table className="min-w-[980px] w-full text-left">

              <thead className="border-b border-slate-100 bg-slate-50/60">

                <tr>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                    User
                  </th>

                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                    Email
                  </th>

                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                    Role
                  </th>

                  <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                    Joined
                  </th>

                  <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.map(
                  (user) => {
                    const isCurrentUser =
                      user.id ===
                      profile?.id

                    return (
                      <tr
                        key={
                          user.id
                        }
                        className="group transition hover:bg-slate-50/70"
                      >

                        {/* USER */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0A0C0B] text-sm font-semibold text-[#D0A765]">

                              {user.avatar_url ? (
                                <img
                                  src={
                                    user.avatar_url
                                  }
                                  alt={
                                    user.full_name ||
                                    user.email
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getInitials(
                                  user.full_name,
                                  user.email
                                )
                              )}

                            </div>

                            <div className="min-w-0">

                              <div className="flex items-center gap-2">

                                <p className="truncate text-sm font-semibold text-slate-950">
                                  {user.full_name ||
                                    'Unnamed user'}
                                </p>

                                {isCurrentUser && (
                                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.15em] text-slate-500">
                                    You
                                  </span>
                                )}

                              </div>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                Updated{' '}
                                {formatDateTime(
                                  user.updated_at
                                )}
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td className="px-4 py-4">

                          <a
                            href={`mailto:${user.email}`}
                            className="inline-flex max-w-[280px] truncate text-sm font-medium text-slate-600 transition hover:text-[#A96F35] hover:underline"
                          >
                            {user.email}
                          </a>

                        </td>

                        {/* ROLE */}

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ring-1 ring-inset ${getRoleBadgeClass(
                              user.role
                            )}`}
                          >
                            {
                              ROLE_LABELS[
                                user.role
                              ]
                            }
                          </span>

                        </td>

                        {/* JOINED */}

                        <td className="px-4 py-4">

                          <div>

                            <p className="text-sm font-medium text-slate-700">
                              {formatDate(
                                user.created_at
                              )}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              Profile created
                            </p>

                          </div>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex items-center justify-end gap-2">

                            <div className="relative">

                              <select
                                value={
                                  user.role
                                }
                                disabled={
                                  isCurrentUser
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleUpdateRole(
                                    user.id,
                                    event.target
                                      .value as Role
                                  )
                                }
                                className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                aria-label={`Change role for ${user.email}`}
                              >

                                {ROLE_OPTIONS.map(
                                  (
                                    option
                                  ) => (
                                    <option
                                      key={
                                        option.value
                                      }
                                      value={
                                        option.value
                                      }
                                    >
                                      {
                                        option.label
                                      }
                                    </option>
                                  )
                                )}

                              </select>

                              <ChevronDown
                                size={
                                  13
                                }
                                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                              />

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteUser(
                                  user.id
                                )
                              }
                              disabled={
                                isCurrentUser
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-slate-300 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Delete profile for ${user.email}`}
                            >
                              <Trash2
                                size={
                                  15
                                }
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        </section>
      )}

      {/* ======================================================
          SECURITY FOOTNOTE
      ====================================================== */}

      <section className="rounded-[22px] border border-slate-200/80 bg-[#0A0C0B] px-5 py-4 text-white shadow-[0_12px_35px_rgba(10,12,11,0.10)] sm:px-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#D0A765]">
              <ShieldCheck size={16} />
            </div>

            <div>

              <p className="text-xs font-semibold">
                Protected user administration
              </p>

              <p className="mt-1 max-w-3xl text-[10px] leading-5 text-white/45">
                Role checks are performed before sensitive operations, while Supabase Row Level Security remains the final authorization boundary.
              </p>

            </div>

          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">

            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Current role
            </p>

            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#D0A765]">
              {profile?.role
                ? ROLE_LABELS[
                    profile.role
                  ]
                : 'Restricted'}
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={14} />
          Previous page
        </button>

        <button
          type="button"
          onClick={
            handleInvite
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
        >
          <Plus size={14} />
          Invite User
        </button>

      </div>

    </div>
  )
}