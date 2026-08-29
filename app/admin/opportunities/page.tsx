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
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Opportunity = {
  id: string
  reference: string
  category:
    | 'investor'
    | 'concession'
    | 'mineral_supply'
    | 'mining_company'
    | 'strategic_partner'
    | 'other'
  status:
    | 'new'
    | 'under_review'
    | 'awaiting_information'
    | 'qualified'
    | 'assigned'
    | 'in_discussion'
    | 'active'
    | 'on_hold'
    | 'closed'
    | 'rejected'
  priority: 'high' | 'medium' | 'standard'
  contact_id: string | null
  organization_id: string | null
  description: string | null
  assigned_to: string | null
  submitted_at: string
  updated_at: string
  closed_at: string | null
  source: string | null
  metadata: Record<string, unknown> | null
}

type UserProfile = {
  id: string
  email: string
  role:
    | 'super_admin'
    | 'admin'
    | 'opportunity_manager'
    | 'content_manager'
    | 'operations_manager'
    | 'viewer'
  full_name: string | null
}

/* ============================================================
   CONSTANTS
============================================================ */

const CATEGORY_LABELS: Record<
  Opportunity['category'],
  string
> = {
  investor: 'Investor',
  concession: 'Asset / Concession',
  mineral_supply: 'Mineral Supply',
  mining_company: 'Mining Company',
  strategic_partner: 'Strategic Partner',
  other: 'Other',
}

const STATUS_LABELS: Record<
  Opportunity['status'],
  string
> = {
  new: 'New',
  under_review: 'Under Review',
  awaiting_information: 'Awaiting Information',
  qualified: 'Qualified',
  assigned: 'Assigned',
  in_discussion: 'In Discussion',
  active: 'Active',
  on_hold: 'On Hold',
  closed: 'Closed',
  rejected: 'Rejected',
}

const PRIORITY_LABELS: Record<
  Opportunity['priority'],
  string
> = {
  high: 'High',
  medium: 'Medium',
  standard: 'Standard',
}

const STATUS_OPTIONS = Object.entries(
  STATUS_LABELS
).map(([value, label]) => ({
  value,
  label,
}))

const CATEGORY_OPTIONS = Object.entries(
  CATEGORY_LABELS
).map(([value, label]) => ({
  value,
  label,
}))

const PRIORITY_OPTIONS = Object.entries(
  PRIORITY_LABELS
).map(([value, label]) => ({
  value,
  label,
}))

const ITEMS_PER_PAGE = 10

const AUTHORIZED_ROLES = [
  'super_admin',
  'admin',
  'opportunity_manager',
] as const

/* ============================================================
   HELPERS
============================================================ */

function formatDate(
  value: string | null | undefined
) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatRelativeDate(
  value: string | null | undefined
) {
  if (!value) return '—'

  const timestamp = new Date(value).getTime()

  if (Number.isNaN(timestamp)) {
    return '—'
  }

  const difference =
    Math.max(0, Date.now() - timestamp)

  const minutes = Math.floor(
    difference / 1000 / 60
  )

  const hours = Math.floor(
    difference / 1000 / 60 / 60
  )

  const days = Math.floor(
    difference / 1000 / 60 / 60 / 24
  )

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return formatDate(value)
}

function getStatusClass(
  status: Opportunity['status']
) {
  switch (status) {
    case 'new':
      return 'bg-blue-50 text-blue-700 ring-blue-600/10'

    case 'under_review':
      return 'bg-amber-50 text-amber-700 ring-amber-600/10'

    case 'awaiting_information':
      return 'bg-orange-50 text-orange-700 ring-orange-600/10'

    case 'qualified':
      return 'bg-violet-50 text-violet-700 ring-violet-600/10'

    case 'assigned':
      return 'bg-indigo-50 text-indigo-700 ring-indigo-600/10'

    case 'in_discussion':
      return 'bg-cyan-50 text-cyan-700 ring-cyan-600/10'

    case 'active':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'

    case 'on_hold':
      return 'bg-slate-100 text-slate-600 ring-slate-500/10'

    case 'closed':
      return 'bg-slate-100 text-slate-700 ring-slate-500/10'

    case 'rejected':
      return 'bg-red-50 text-red-700 ring-red-600/10'

    default:
      return 'bg-slate-50 text-slate-600 ring-slate-500/10'
  }
}

function getPriorityClass(
  priority: Opportunity['priority']
) {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-700 ring-red-600/10'

    case 'medium':
      return 'bg-amber-50 text-amber-700 ring-amber-600/10'

    case 'standard':
      return 'bg-slate-50 text-slate-600 ring-slate-500/10'

    default:
      return 'bg-slate-50 text-slate-600 ring-slate-500/10'
  }
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
          ? 'No matching opportunities'
          : 'No opportunities yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? 'No opportunity matches the current search and filters. Try adjusting your criteria.'
          : 'There are currently no opportunities in the workspace.'}
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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus size={15} />
            Create opportunity
          </button>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   MOBILE CARD
============================================================ */

function OpportunityCard({
  item,
  onOpen,
}: {
  item: Opportunity
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-[22px] border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {item.reference}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {CATEGORY_LABELS[item.category]}
          </p>
        </div>

        <ArrowRight
          size={17}
          className="shrink-0 text-slate-300"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getStatusClass(
            item.status
          )}`}
        >
          {STATUS_LABELS[item.status]}
        </span>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getPriorityClass(
            item.priority
          )}`}
        >
          {PRIORITY_LABELS[item.priority]}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Submitted
          </p>

          <p className="mt-1 text-xs font-medium text-slate-700">
            {formatDate(item.submitted_at)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Updated
          </p>

          <p className="mt-1 text-xs font-medium text-slate-700">
            {formatRelativeDate(item.updated_at)}
          </p>
        </div>
      </div>
    </button>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function OpportunitiesPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     SESSION / SECURITY
  ---------------------------------------------------------- */

  const [profile, setProfile] =
    useState<UserProfile | null>(null)

  const [authorized, setAuthorized] =
    useState(false)

  const [authChecking, setAuthChecking] =
    useState(true)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [opportunities, setOpportunities] =
    useState<Opportunity[]>([])

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

  const [categoryFilter, setCategoryFilter] =
    useState<string>('all')

  const [priorityFilter, setPriorityFilter] =
    useState<string>('all')

  const [showFilters, setShowFilters] =
    useState(false)

  /* ----------------------------------------------------------
     PAGINATION
  ---------------------------------------------------------- */

  const [page, setPage] =
    useState(1)

  /* ==========================================================
     SECURITY / AUTHENTICATION
  ========================================================== */

  const checkAccess = useCallback(
    async () => {
      setAuthChecking(true)

      try {
        const {
          data: {
            user,
          },
        } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        const {
          data: currentProfile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select(
            'id, email, full_name, role'
          )
          .eq('id', user.id)
          .maybeSingle()

        if (profileError || !currentProfile) {
          console.error(
            'Profile access error:',
            profileError
          )

          router.replace('/login')
          return
        }

        const typedProfile =
          currentProfile as UserProfile

        setProfile(typedProfile)

        const canAccess =
          AUTHORIZED_ROLES.includes(
            typedProfile.role as (typeof AUTHORIZED_ROLES)[number]
          )

        setAuthorized(canAccess)
      } catch (accessError) {
        console.error(
          'Access verification error:',
          accessError
        )

        router.replace('/login')
      } finally {
        setAuthChecking(false)
      }
    },
    [router, supabase]
  )

  useEffect(() => {
    checkAccess()
  }, [checkAccess])

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
        (event, session) => {
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
     LOAD OPPORTUNITIES
  ========================================================== */

  const loadOpportunities = useCallback(
    async (isRefresh = false) => {
      if (!authorized) return

      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null)

      try {
        let query = supabase
          .from('opportunities')
          .select(
            `
              id,
              reference,
              category,
              status,
              priority,
              contact_id,
              organization_id,
              description,
              assigned_to,
              submitted_at,
              updated_at,
              closed_at,
              source,
              metadata
            `
          )
          .order('submitted_at', {
            ascending: false,
          })

        if (statusFilter !== 'all') {
          query = query.eq(
            'status',
            statusFilter
          )
        }

        if (categoryFilter !== 'all') {
          query = query.eq(
            'category',
            categoryFilter
          )
        }

        if (priorityFilter !== 'all') {
          query = query.eq(
            'priority',
            priorityFilter
          )
        }

        const {
          data,
          error: queryError,
        } = await query

        if (queryError) {
          console.error(
            'Opportunities query error:',
            queryError
          )

          setError(
            'Unable to load opportunities. Please check your permissions and try again.'
          )

          setOpportunities([])
          return
        }

        setOpportunities(
          (data as Opportunity[]) ?? []
        )
      } catch (requestError) {
        console.error(
          'Opportunities request error:',
          requestError
        )

        setError(
          'An unexpected error occurred while loading opportunities.'
        )

        setOpportunities([])
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [
      authorized,
      categoryFilter,
      priorityFilter,
      statusFilter,
      supabase,
    ]
  )

  useEffect(() => {
    if (authorized) {
      loadOpportunities()
    }
  }, [
    authorized,
    loadOpportunities,
  ])

  /* ==========================================================
     LOCAL SEARCH
  ========================================================== */

  const filteredOpportunities =
    useMemo(() => {
      const term = search
        .trim()
        .toLowerCase()

      if (!term) {
        return opportunities
      }

      return opportunities.filter(
        (item) => {
          const metadataText =
            item.metadata
              ? JSON.stringify(
                  item.metadata
                ).toLowerCase()
              : ''

          const description =
            item.description
              ?.toLowerCase() ?? ''

          const source =
            item.source
              ?.toLowerCase() ?? ''

          return (
            item.reference
              .toLowerCase()
              .includes(term) ||
            CATEGORY_LABELS[
              item.category
            ]
              .toLowerCase()
              .includes(term) ||
            STATUS_LABELS[
              item.status
            ]
              .toLowerCase()
              .includes(term) ||
            PRIORITY_LABELS[
              item.priority
            ]
              .toLowerCase()
              .includes(term) ||
            description.includes(term) ||
            source.includes(term) ||
            metadataText.includes(term)
          )
        }
      )
    }, [opportunities, search])

  /* ==========================================================
     RESET PAGE WHEN FILTERS CHANGE
  ========================================================== */

  useEffect(() => {
    setPage(1)
  }, [
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
  ])

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOpportunities.length /
        ITEMS_PER_PAGE
    )
  )

  const safePage = Math.min(
    page,
    totalPages
  )

  const paginatedOpportunities =
    useMemo(() => {
      const start =
        (safePage - 1) *
        ITEMS_PER_PAGE

      return filteredOpportunities.slice(
        start,
        start + ITEMS_PER_PAGE
      )
    }, [
      filteredOpportunities,
      safePage,
    ])

  const rangeStart =
    filteredOpportunities.length === 0
      ? 0
      : (safePage - 1) *
          ITEMS_PER_PAGE +
        1

  const rangeEnd = Math.min(
    safePage * ITEMS_PER_PAGE,
    filteredOpportunities.length
  )

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts = useMemo(() => {
    return {
      total: opportunities.length,

      new: opportunities.filter(
        (item) =>
          item.status === 'new'
      ).length,

      review: opportunities.filter(
        (item) =>
          item.status ===
            'under_review' ||
          item.status ===
            'awaiting_information'
      ).length,

      active: opportunities.filter(
        (item) =>
          item.status === 'active'
      ).length,

      highPriority:
        opportunities.filter(
          (item) =>
            item.priority === 'high'
        ).length,
    }
  }, [opportunities])

  /* ==========================================================
     ACTIVE FILTERS
  ========================================================== */

  const hasActiveFilters =
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    priorityFilter !== 'all' ||
    search.trim() !== ''

  const clearFilters = () => {
    setStatusFilter('all')
    setCategoryFilter('all')
    setPriorityFilter('all')
    setSearch('')
    setPage(1)
  }

  /* ==========================================================
     LOADING / AUTH
  ========================================================== */

  if (authChecking) {
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
            Preparing the opportunity workspace...
          </p>
        </div>
      </div>
    )
  }

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
            Your current role does not have permission to access opportunity management.
          </p>

          <p className="mt-3 text-xs text-slate-400">
            Signed in as{' '}
            {profile?.email ?? 'unknown user'}
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace('/admin')
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

      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <section>

        {/* BREADCRUMB / BACK */}

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={() =>
              router.push('/admin')
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
            Opportunities
          </span>

        </div>

        {/* MAIN HEADER */}

        <div className="mt-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

          <div>

            <div className="flex flex-wrap items-center gap-2">

              <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                Opportunity Center
              </span>

              {counts.highPriority > 0 && (
                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-red-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                  {counts.highPriority}{' '}
                  high priority
                </span>
              )}

              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Protected workspace
              </span>

            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
              Opportunities
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage, review and track every opportunity
              submitted to Barack Mining Investment.
            </p>
          </div>

          {/* HEADER ACTIONS */}

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadOpportunities(true)
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
                  '/admin/opportunities/new'
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
            >
              <Plus size={16} />
              New Opportunity
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================
          SUMMARY STRIP
      ======================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <button
          type="button"
          onClick={clearFilters}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Total
            </span>

            <BriefcaseBusiness
              size={16}
              className="text-slate-400 transition group-hover:text-slate-700"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.total}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            All opportunities
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('new')
            setCategoryFilter('all')
            setPriorityFilter('all')
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              New
            </span>

            <Clock3
              size={16}
              className="text-blue-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.new}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Awaiting initial handling
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('under_review')
            setCategoryFilter('all')
            setPriorityFilter('all')
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Under review
            </span>

            <AlertCircle
              size={16}
              className="text-amber-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.review}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Review or information required
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter('active')
            setCategoryFilter('all')
            setPriorityFilter('all')
            setSearch('')
          }}
          className="group rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
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
            Currently active
          </p>
        </button>

      </section>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <AlertCircle size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Unable to load opportunities
            </p>

            <p className="mt-1 text-xs leading-5 text-red-700/80">
              {error}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              loadOpportunities(true)
            }
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 hover:text-red-900"
          >
            Retry
          </button>

        </div>
      )}

      {/* ========================================================
          SEARCH / FILTER TOOLBAR
      ======================================================== */}

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
              placeholder="Search reference, category, status, source..."
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
              <SlidersHorizontal
                size={16}
              />

              Filters

              {hasActiveFilters && (
                <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[10px]">
                  {
                    [
                      statusFilter !==
                        'all',
                      categoryFilter !==
                        'all',
                      priorityFilter !==
                        'all',
                      Boolean(
                        search.trim()
                      ),
                    ].filter(Boolean)
                      .length
                  }
                </span>
              )}

              <ChevronDown
                size={14}
                className={
                  showFilters
                    ? 'rotate-180 transition-transform'
                    : 'transition-transform'
                }
              />

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

        {/* FILTER PANEL */}

        {showFilters && (
          <div className="mt-4 border-t border-slate-100 pt-4">

            <div className="grid gap-4 md:grid-cols-3">

              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Status
                </label>

                <select
                  id="status-filter"
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

              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Category
                </label>

                <select
                  id="category-filter"
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                >
                  <option value="all">
                    All categories
                  </option>

                  {CATEGORY_OPTIONS.map(
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

              <div>
                <label
                  htmlFor="priority-filter"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Priority
                </label>

                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(
                      event.target.value
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                >
                  <option value="all">
                    All priorities
                  </option>

                  {PRIORITY_OPTIONS.map(
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
          </div>
        )}

      </section>

      {/* ========================================================
          ACTIVE FILTERS
      ======================================================== */}

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
                  statusFilter as Opportunity['status']
                ]
              }`}
              onRemove={() =>
                setStatusFilter('all')
              }
            />
          )}

          {categoryFilter !==
            'all' && (
            <FilterBadge
              label={`Category: ${
                CATEGORY_LABELS[
                  categoryFilter as Opportunity['category']
                ]
              }`}
              onRemove={() =>
                setCategoryFilter('all')
              }
            />
          )}

          {priorityFilter !==
            'all' && (
            <FilterBadge
              label={`Priority: ${
                PRIORITY_LABELS[
                  priorityFilter as Opportunity['priority']
                ]
              }`}
              onRemove={() =>
                setPriorityFilter('all')
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

      {/* ========================================================
          RESULT HEADER
      ======================================================== */}

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {filteredOpportunities.length}{' '}
            {filteredOpportunities.length ===
            1
              ? 'opportunity'
              : 'opportunities'}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {hasActiveFilters
              ? 'Matching your current criteria'
              : 'Complete opportunity register'}
          </p>
        </div>

        {filteredOpportunities.length >
          0 && (
          <div className="text-xs text-slate-400">
            Showing {rangeStart}–{rangeEnd}{' '}
            of {filteredOpportunities.length}
          </div>
        )}

      </div>

      {/* ========================================================
          LOADING CONTENT
      ======================================================== */}

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
              Loading opportunities
            </p>

          </div>

          <div className="hidden md:block">

            <div className="border-b border-slate-100 px-5 py-4">
              <div className="grid grid-cols-6 gap-4">

                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-3 animate-pulse rounded bg-slate-100"
                  />
                ))}

              </div>
            </div>

            <div className="divide-y divide-slate-100">

              {Array.from({
                length: 7,
              }).map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 gap-4 px-5 py-5"
                >
                  {Array.from({
                    length: 6,
                  }).map(
                    (_, cellIndex) => (
                      <div
                        key={cellIndex}
                        className="h-4 animate-pulse rounded bg-slate-100"
                      />
                    )
                  )}
                </div>
              ))}

            </div>
          </div>

          <div className="space-y-3 p-4 md:hidden">

            {Array.from({
              length: 4,
            }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}

          </div>
        </div>
      ) : filteredOpportunities.length ===
        0 ? (
        <EmptyState
          filtered={hasActiveFilters}
          onCreate={() =>
            router.push(
              '/admin/opportunities/new'
            )
          }
          onClear={clearFilters}
        />
      ) : (
        <>
          {/* ======================================================
              DESKTOP TABLE
          ====================================================== */}

          <section className="hidden overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)] md:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/60">

                  <tr>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Opportunity
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Category
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Status
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Priority
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Submitted
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {paginatedOpportunities.map(
                    (item) => (
                      <tr
                        key={item.id}
                        onClick={() =>
                          router.push(
                            `/admin/opportunities/${item.id}`
                          )
                        }
                        className="group cursor-pointer transition hover:bg-slate-50/70"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-950 group-hover:text-white">
                              <BriefcaseBusiness
                                size={16}
                              />
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-semibold text-slate-950">
                                {item.reference}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-[11px] text-slate-400">
                                {item.source ??
                                  'Website submission'}
                              </p>

                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="max-w-[170px] text-sm text-slate-600">
                            {
                              CATEGORY_LABELS[
                                item.category
                              ]
                            }
                          </p>
                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {
                              STATUS_LABELS[
                                item.status
                              ]
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ring-1 ring-inset ${getPriorityClass(
                              item.priority
                            )}`}
                          >
                            {
                              PRIORITY_LABELS[
                                item.priority
                              ]
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <div>

                            <p className="text-sm font-medium text-slate-700">
                              {formatDate(
                                item.submitted_at
                              )}
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {formatRelativeDate(
                                item.submitted_at
                              )}
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-right">

                          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-300 transition group-hover:border-slate-200 group-hover:bg-white group-hover:text-slate-700">
                            <ArrowRight
                              size={16}
                            />
                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>
              </table>
            </div>

            {/* DESKTOP FOOTER */}

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

              <p className="text-xs text-slate-400">
                Showing{' '}
                <span className="font-semibold text-slate-600">
                  {rangeStart}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-600">
                  {rangeEnd}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-600">
                  {
                    filteredOpportunities.length
                  }
                </span>
              </p>

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  disabled={
                    safePage <= 1
                  }
                  onClick={() =>
                    setPage(
                      (value) =>
                        Math.max(
                          1,
                          value - 1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft
                    size={15}
                  />
                </button>

                <div className="px-3 text-xs font-semibold text-slate-600">
                  {safePage} / {totalPages}
                </div>

                <button
                  type="button"
                  disabled={
                    safePage >=
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (value) =>
                        Math.min(
                          totalPages,
                          value + 1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight
                    size={15}
                  />
                </button>

              </div>
            </div>

          </section>

          {/* ======================================================
              MOBILE CARDS
          ====================================================== */}

          <section className="space-y-3 md:hidden">

            {paginatedOpportunities.map(
              (item) => (
                <OpportunityCard
                  key={item.id}
                  item={item}
                  onOpen={() =>
                    router.push(
                      `/admin/opportunities/${item.id}`
                    )
                  }
                />
              )
            )}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3">

              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setPage(
                    (value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft
                  size={16}
                />
              </button>

              <span className="text-xs font-semibold text-slate-600">
                Page {safePage} of{' '}
                {totalPages}
              </span>

              <button
                type="button"
                disabled={
                  safePage >=
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (value) =>
                      Math.min(
                        totalPages,
                        value + 1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight
                  size={16}
                />
              </button>

            </div>

          </section>
        </>
      )}

      {/* ========================================================
          SECURITY FOOTNOTE
      ======================================================== */}

      <section className="flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldAlert size={16} />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-800">
              Protected workspace
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
              Opportunity access is controlled by authenticated
              user roles and Supabase RLS policies.
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

      {/* ========================================================
          BOTTOM NAVIGATION
      ======================================================== */}

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
              '/admin/opportunities/new'
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
        >
          <Plus size={14} />
          Create Opportunity
        </button>

      </div>

    </div>
  )
}