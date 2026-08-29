'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type TeamMember = {
  id: string
  full_name: string
  position: string
  bio: string | null
  photo_url: string | null
  display_order: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

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
}

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS_LABELS: Record<
  TeamMember['status'],
  string
> = {
  active: 'Active',
  inactive: 'Inactive',
}

const STATUS_OPTIONS = Object.entries(
  STATUS_LABELS
).map(([value, label]) => ({
  value,
  label,
}))

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'content_manager',
]

/* ============================================================
   HELPERS
============================================================ */

function getStatusClass(
  status: TeamMember['status']
) {
  return status === 'active'
    ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'
    : 'bg-slate-100 text-slate-500 ring-slate-500/10'
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
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

function getInitials(
  name: string | null | undefined
) {
  const source =
    name?.trim() || 'BMI'

  const parts = source
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return 'BM'
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
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
        aria-label={`Remove ${label}`}
        className="rounded-full p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
      >
        <X size={12} />
      </button>
    </span>
  )
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  filtered,
  onCreate,
  onClear,
}: {
  filtered: boolean
  onCreate: () => void
  onClear: () => void
}) {
  return (
    <div className="rounded-[26px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_30px_rgba(10,12,11,0.10)]">

        <img
          src="/images/logo-bmi.png"
          alt="Barack Mining Investment"
          className="max-h-8 max-w-[40px] object-contain brightness-0 invert"
        />

      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-950">
        {filtered
          ? 'No matching team members'
          : 'No team members yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? 'No team member matches the current search or status filter.'
          : 'There are currently no team members in the Content workspace.'}
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
            onClick={onCreate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
          >
            <Plus size={15} />
            Add Member
          </button>
        )}

      </div>
    </div>
  )
}

/* ============================================================
   MOBILE CARD
============================================================ */

function TeamMemberCard({
  member,
  onOpen,
  onDelete,
}: {
  member: TeamMember
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

      <div className="flex items-start gap-4">

        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.full_name}
            className="h-14 w-14 shrink-0 rounded-2xl object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0A0C0B] text-sm font-semibold text-[#D0A765]">
            {getInitials(member.full_name)}
          </div>
        )}

        <div className="min-w-0 flex-1">

          <button
            type="button"
            onClick={onOpen}
            className="block max-w-full text-left"
          >
            <p className="truncate text-sm font-semibold text-slate-950">
              {member.full_name}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {member.position}
            </p>
          </button>

          <div className="mt-3 flex flex-wrap gap-2">

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ring-1 ring-inset ${getStatusClass(
                member.status
              )}`}
            >
              {STATUS_LABELS[member.status]}
            </span>

            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
              Order {member.display_order}
            </span>

          </div>

        </div>

      </div>

      {member.bio && (
        <p className="mt-4 line-clamp-3 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
          {member.bio}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

        <p className="text-[10px] text-slate-400">
          Updated {formatDate(member.updated_at)}
        </p>

        <div className="flex items-center gap-1.5">

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 size={13} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${member.full_name}`}
          >
            <Trash2 size={14} />
          </button>

        </div>

      </div>
    </article>
  )
}

/* ============================================================
   PAGE
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
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
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

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  )
}
export default function TeamPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     SECURITY
  ---------------------------------------------------------- */

  const [profile, setProfile] =
    useState<Profile | null>(null)

  const [authorized, setAuthorized] =
    useState(false)

  const [checkingAccess, setCheckingAccess] =
    useState(true)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [members, setMembers] =
    useState<TeamMember[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  /* ----------------------------------------------------------
     SEARCH / FILTERS
  ---------------------------------------------------------- */

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState<string>('all')

  const [showFilters, setShowFilters] =
    useState(false)

  /* ==========================================================
     ACCESS
  ========================================================== */

  const verifyAccess = useCallback(
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
          router.replace('/login')
          return
        }

        const {
          data: currentProfile,
          error: profileError,
        } =
          await supabase
            .from('profiles')
            .select(
              'id, email, full_name, role'
            )
            .eq('id', user.id)
            .maybeSingle()

        if (
          profileError ||
          !currentProfile
        ) {
          console.error(
            'Profile access error:',
            profileError
          )

          router.replace('/login')
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
      } catch (accessError) {
        console.error(
          'Access verification error:',
          accessError
        )

        router.replace('/login')
      } finally {
        setCheckingAccess(false)
      }
    },
    [router, supabase]
  )

  useEffect(() => {
    verifyAccess()
  }, [verifyAccess])

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
            router.replace('/login')
          }
        }
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  /* ==========================================================
     LOAD MEMBERS
  ========================================================== */

  const loadMembers = useCallback(
    async (isRefresh = false) => {
      if (!authorized) {
        return
      }

      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      try {
        let query =
          supabase
            .from('team_members')
            .select(
              `
                id,
                full_name,
                position,
                bio,
                photo_url,
                display_order,
                status,
                created_at,
                updated_at
              `
            )
            .order(
              'display_order',
              {
                ascending: true,
              }
            )

        if (
          statusFilter !==
          'all'
        ) {
          query =
            query.eq(
              'status',
              statusFilter
            )
        }

        const {
          data,
          error: queryError,
        } =
          await query

        if (queryError) {
          console.error(
            'Team members query error:',
            queryError
          )

          setMembers([])

          setError(
            'Unable to load team members. Please check your permissions and try again.'
          )

          return
        }

        setMembers(
          (data as TeamMember[]) ??
            []
        )
      } catch (requestError) {
        console.error(
          'Team members request error:',
          requestError
        )

        setMembers([])

        setError(
          'An unexpected error occurred while loading the team.'
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [
      authorized,
      statusFilter,
      supabase,
    ]
  )

  useEffect(() => {
    if (authorized) {
      loadMembers()
    }
  }, [
    authorized,
    loadMembers,
  ])

  /* ==========================================================
     SEARCH
  ========================================================== */

  const filteredMembers =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return members
      }

      return members.filter(
        (member) => {
          return (
            member.full_name
              .toLowerCase()
              .includes(term) ||
            member.position
              .toLowerCase()
              .includes(term) ||
            member.bio
              ?.toLowerCase()
              .includes(term)
          )
        }
      )
    }, [members, search])

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts = useMemo(() => {
    return {
      total: members.length,

      active: members.filter(
        (member) =>
          member.status ===
          'active'
      ).length,

      inactive: members.filter(
        (member) =>
          member.status ===
          'inactive'
      ).length,
    }
  }, [members])

  /* ==========================================================
     FILTERS
  ========================================================== */

  const hasActiveFilters =
    statusFilter !== 'all' ||
    search.trim() !== ''

  const clearFilters = () => {
    setStatusFilter('all')
    setSearch('')
  }

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = async (
    id: string
  ) => {
    const member =
      members.find(
        (item) =>
          item.id === id
      )

    if (!member) {
      return
    }

    const confirmed =
      window.confirm(
        `Delete "${member.full_name}"?\n\nThis action cannot be undone.`
      )

    if (!confirmed) {
      return
    }

    setError(null)

    try {
      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser()

      if (!user) {
        router.replace('/login')
        return
      }

      const {
        data: currentProfile,
        error: profileError,
      } =
        await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

      if (
        profileError ||
        !currentProfile ||
        !AUTHORIZED_ROLES.includes(
          currentProfile.role as Role
        )
      ) {
        throw new Error(
          'Your current account is not authorized to delete team members.'
        )
      }

      const {
        error: deleteError,
      } =
        await supabase
          .from('team_members')
          .delete()
          .eq(
            'id',
            id
          )

      if (deleteError) {
        console.error(
          'Team member deletion error:',
          deleteError
        )

        throw new Error(
          deleteError.message ||
            'Unable to delete this team member.'
        )
      }

      setMembers(
        (current) =>
          current.filter(
            (item) =>
              item.id !== id
          )
      )
    } catch (deleteRequestError) {
      console.error(
        'Team member deletion failed:',
        deleteRequestError
      )

      setError(
        deleteRequestError instanceof Error
          ? deleteRequestError.message
          : 'Unable to delete this team member.'
      )
    }
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (checkingAccess) {
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
            Verifying secure access
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Preparing the team workspace...
          </p>

        </div>
      </div>
    )
  }

  /* ==========================================================
     ACCESS DENIED
  ========================================================== */

  if (!authorized) {
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
            Your current role does not have permission to manage team content.
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
    <div className="space-y-6 pb-10">

      {/* ======================================================
          HEADER / BREADCRUMB
      ====================================================== */}

      <section>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content'
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
            Content
          </span>

          <span className="text-slate-300">
            /
          </span>

          <span className="text-xs font-semibold text-slate-700">
            Team
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
                  Content
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                Team Members
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the members displayed on the Barack Mining Investment public website.
              </p>

            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadMembers(true)
              }
              disabled={refreshing}
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
              onClick={() =>
                router.push(
                  '/admin/content/team/new'
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add Member
            </button>

          </div>
        </div>
      </section>

      {/* ======================================================
          CONTENT NAVIGATION
      ====================================================== */}

      <section className="rounded-[24px] border border-slate-200/80 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

        <div className="grid grid-cols-2 gap-1">

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/news'
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            News
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/team'
              )
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white shadow-sm"
          >
            <Users size={15} />
            Team
          </button>

        </div>
      </section>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <section className="grid gap-3 sm:grid-cols-3">

        <button
          type="button"
          onClick={clearFilters}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Total
            </span>

            <Users
              size={16}
              className="text-slate-400 transition group-hover:text-slate-700"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.total}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            All team members
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('active')
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Active
            </span>

            <CheckCircle2
              size={16}
              className="text-emerald-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.active}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Visible team members
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('inactive')
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Inactive
            </span>

            <User
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.inactive}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Not currently displayed
          </p>

        </button>

      </section>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <AlertCircle size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Content operation failed
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setError(null)
            }
            className="rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-700"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* ======================================================
          SEARCH / FILTERS
      ====================================================== */}

      <Section
        eyebrow="Directory"
        title="Team register"
        description="Search and filter the people currently managed in the Content workspace."
      >

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
              placeholder="Search name, position or bio..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) => !value
                )
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition ${
                showFilters ||
                hasActiveFilters
                  ? 'border-slate-900 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ChevronDown
                size={14}
                className={
                  showFilters
                    ? 'rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />

              Filters

              {hasActiveFilters && (
                <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px]">
                  {
                    [
                      statusFilter !==
                        'all',
                      Boolean(
                        search.trim()
                      ),
                    ].filter(Boolean)
                      .length
                  }
                </span>
              )}

            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={14} />
                Clear
              </button>
            )}

          </div>
        </div>

        {showFilters && (
          <div className="mt-4 border-t border-slate-100 pt-4">

            <div className="max-w-sm">

              <label
                htmlFor="team-status-filter"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
              >
                Status
              </label>

              <select
                id="team-status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
              >
                <option value="all">
                  All statuses
                </option>

                {STATUS_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>

            </div>
          </div>
        )}
      </Section>

      {/* ======================================================
          ACTIVE FILTERS
      ====================================================== */}

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">

          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Active filters
          </span>

          {statusFilter !==
            'all' && (
            <FilterBadge
              label={`Status: ${
                STATUS_LABELS[
                  statusFilter as TeamMember['status']
                ]
              }`}
              onRemove={() =>
                setStatusFilter('all')
              }
            />
          )}

          {search.trim() && (
            <FilterBadge
              label={`Search: "${search.trim()}"`}
              onRemove={() =>
                setSearch('')
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
            {filteredMembers.length}{' '}
            {filteredMembers.length ===
            1
              ? 'member'
              : 'members'}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {hasActiveFilters
              ? 'Matching your current criteria'
              : 'Complete team register'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">

          <CalendarDays size={14} />

          <span>
            Managed team directory
          </span>

        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      {loading ? (
        <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="flex flex-col items-center justify-center border-b border-slate-100 px-5 py-8">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B]">

              <img
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                className="max-h-7 max-w-[35px] object-contain brightness-0 invert"
              />

            </div>

            <div className="mt-4 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            <p className="mt-3 text-xs font-semibold text-slate-700">
              Loading team
            </p>

          </div>

          <div className="hidden md:block">

            <div className="border-b border-slate-100 px-5 py-4">

              <div className="grid grid-cols-6 gap-4">

                {Array.from({
                  length: 6,
                }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-3 animate-pulse rounded bg-slate-100"
                    />
                  )
                )}

              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {Array.from({
                length: 7,
              }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-6 gap-4 px-5 py-5"
                  >

                    {Array.from({
                      length: 6,
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
                  key={index}
                  className="h-40 animate-pulse rounded-2xl bg-slate-100"
                />
              )
            )}

          </div>
        </div>
      ) : filteredMembers.length ===
        0 ? (
        <EmptyState
          filtered={hasActiveFilters}
          onCreate={() =>
            router.push(
              '/admin/content/team/new'
            )
          }
          onClear={
            clearFilters
          }
        />
      ) : (
        <>
          {/* ====================================================
              DESKTOP TABLE
          ==================================================== */}

          <section className="hidden overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)] md:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/60">

                  <tr>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Member
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Position
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Status
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Display order
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Updated
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredMembers.map(
                    (member) => (
                      <tr
                        key={
                          member.id
                        }
                        className="group transition hover:bg-slate-50/70"
                      >

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/content/team/${member.id}`
                              )
                            }
                            className="flex items-center gap-3 text-left"
                          >

                            {member.photo_url ? (
                              <img
                                src={
                                  member.photo_url
                                }
                                alt={
                                  member.full_name
                                }
                                className="h-11 w-11 shrink-0 rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0A0C0B] text-xs font-semibold text-[#D0A765]">
                                {getInitials(
                                  member.full_name
                                )}
                              </div>
                            )}

                            <div className="min-w-0">

                              <p className="max-w-[240px] truncate text-sm font-semibold text-slate-950">
                                {
                                  member.full_name
                                }
                              </p>

                              <p className="mt-1 max-w-[240px] truncate text-[11px] text-slate-400">
                                Team member
                              </p>

                            </div>

                          </button>

                        </td>

                        <td className="px-4 py-4">

                          <p className="max-w-[220px] truncate text-sm text-slate-600">
                            {
                              member.position
                            }
                          </p>

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ring-1 ring-inset ${getStatusClass(
                              member.status
                            )}`}
                          >
                            {
                              STATUS_LABELS[
                                member.status
                              ]
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                            {
                              member.display_order
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <p className="text-sm font-medium text-slate-700">
                            {formatDate(
                              member.updated_at
                            )}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            Updated
                          </p>

                        </td>

                        <td className="px-5 py-4 text-right">

                          <div className="flex items-center justify-end gap-1.5">

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/admin/content/team/${member.id}`
                                )
                              }
                              aria-label={`Edit ${member.full_name}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  member.id
                                )
                              }
                              aria-label={`Delete ${member.full_name}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/admin/content/team/${member.id}`
                                )
                              }
                              aria-label={`Open ${member.full_name}`}
                              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <ArrowRight
                                size={15}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>
              </table>
            </div>
          </section>

          {/* ====================================================
              MOBILE
          ==================================================== */}

          <section className="space-y-3 md:hidden">

            {filteredMembers.map(
              (member) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  onOpen={() =>
                    router.push(
                      `/admin/content/team/${member.id}`
                    )
                  }
                  onDelete={() =>
                    handleDelete(
                      member.id
                    )
                  }
                />
              )
            )}

          </section>
        </>
      )}

      {/* ======================================================
          SECURITY
      ====================================================== */}

      <section className="flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={16} />
          </div>

          <div>

            <p className="text-xs font-semibold text-slate-800">
              Protected content workspace
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
              Team management is controlled by authenticated roles and Supabase RLS policies.
            </p>

          </div>
        </div>

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {profile?.role
            ? profile.role.replace(
                /_/g,
                ' '
              )
            : 'restricted'}
        </span>

      </section>

      {/* ======================================================
          BOTTOM NAVIGATION
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
          onClick={() =>
            router.push(
              '/admin/content/team/new'
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
        >
          <Plus size={14} />
          Add Member
        </button>

      </div>

    </div>
  )
}