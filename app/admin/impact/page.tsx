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
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Globe2,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type ImpactStatus =
  | 'draft'
  | 'published'
  | 'archived'

type Project = {
  id: string
  title: string
  slug: string
  location: string | null
  status: ImpactStatus
  description: string | null
  cover_image_url: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

type Story = {
  id: string
  title: string
  slug: string
  author: string | null
  status: ImpactStatus
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
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

type ActiveTab =
  | 'projects'
  | 'stories'

/* ============================================================
   CONSTANTS
============================================================ */

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'content_manager',
]

const STATUS_LABELS: Record<
  ImpactStatus,
  string
> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

const STATUS_OPTIONS = Object.entries(
  STATUS_LABELS
).map(
  ([value, label]) => ({
    value,
    label,
  })
)

const ITEMS_PER_PAGE = 10

/* ============================================================
   HELPERS
============================================================ */

function getStatusClass(
  status: ImpactStatus
) {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-600 ring-slate-500/10'

    case 'published':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/10'

    case 'archived':
      return 'bg-slate-100 text-slate-400 ring-slate-500/10'

    default:
      return 'bg-slate-50 text-slate-600 ring-slate-500/10'
  }
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) {
    return '—'
  }

  const date =
    new Date(value)

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

function formatRelativeDate(
  value: string | null | undefined
) {
  if (!value) {
    return '—'
  }

  const timestamp =
    new Date(value).getTime()

  if (
    Number.isNaN(
      timestamp
    )
  ) {
    return '—'
  }

  const difference =
    Math.max(
      0,
      Date.now() -
        timestamp
    )

  const minutes =
    Math.floor(
      difference /
        1000 /
        60
    )

  const hours =
    Math.floor(
      difference /
        1000 /
        60 /
        60
    )

  const days =
    Math.floor(
      difference /
        1000 /
        60 /
        60 /
        24
    )

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  if (hours < 24) {
    return `${hours}h ago`
  }

  if (days < 7) {
    return `${days}d ago`
  }

  return formatDate(value)
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
          Preparing secure impact workspace
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading community impact data...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({
  tab,
  filtered,
  onCreate,
  onClear,
}: {
  tab: ActiveTab
  filtered: boolean
  onCreate: () => void
  onClear: () => void
}) {
  const label =
    tab === 'projects'
      ? 'projects'
      : 'stories'

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
          ? `No matching ${label}`
          : `No ${label} yet`}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? `No ${label} match the current search or filters.`
          : `There are currently no ${label} in the Impact workspace.`}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2">

        {filtered && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X size={14} />
            Clear filters
          </button>
        )}

        {!filtered && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
          >
            <Plus size={15} />
            New{' '}
            {tab === 'projects'
              ? 'Project'
              : 'Story'}
          </button>
        )}

      </div>
    </div>
  )
}

/* ============================================================
   PROJECT CARD
============================================================ */

function ProjectCard({
  item,
  onOpen,
  onDelete,
}: {
  item: Project
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(15,23,42,0.07)]">

      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-100 text-left"
      >

        {item.cover_image_url ? (
          <img
            src={
              item.cover_image_url
            }
            alt={
              item.title
            }
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#0A0C0B] text-white">

            <img
              src="/images/logo-bmi.png"
              alt=""
              aria-hidden="true"
              className="max-h-8 max-w-[40px] object-contain brightness-0 invert opacity-80"
            />

            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
              Impact Project
            </p>

          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ring-1 ring-inset ${getStatusClass(
              item.status
            )}`}
          >
            {
              STATUS_LABELS[
                item.status
              ]
            }
          </span>
        </div>

      </button>

      <div className="p-4">

        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left"
        >

          <h3 className="truncate text-sm font-semibold text-slate-950">
            {item.title}
          </h3>

          <p className="mt-1 truncate text-[11px] text-slate-400">
            /impact/projects/
            {item.slug}
          </p>

        </button>

        <div className="mt-3 flex flex-wrap gap-2">

          {item.location && (
            <span className="inline-flex max-w-full items-center rounded-full bg-[#F3EFE7] px-2.5 py-1 text-[10px] font-semibold text-[#94713F]">
              <span className="truncate">
                {item.location}
              </span>
            </span>
          )}

        </div>

        <p className="mt-3 text-[10px] text-slate-400">
          Created{' '}
          {formatDate(
            item.created_at
          )}
        </p>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 size={13} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${item.title}`}
          >
            <Trash2 size={14} />
          </button>

        </div>
      </div>
    </article>
  )
}

/* ============================================================
   STORY CARD
============================================================ */

function StoryCard({
  item,
  onOpen,
  onDelete,
}: {
  item: Story
  onOpen: () => void
  onDelete: () => void
}) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(15,23,42,0.07)]">

      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-100 text-left"
      >

        {item.cover_image_url ? (
          <img
            src={
              item.cover_image_url
            }
            alt={
              item.title
            }
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-white">

            <img
              src="/images/logo-bmi.png"
              alt=""
              aria-hidden="true"
              className="max-h-8 max-w-[40px] object-contain brightness-0 invert opacity-80"
            />

            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
              Impact Story
            </p>

          </div>
        )}

        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ring-1 ring-inset ${getStatusClass(
              item.status
            )}`}
          >
            {
              STATUS_LABELS[
                item.status
              ]
            }
          </span>
        </div>

      </button>

      <div className="p-4">

        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left"
        >

          <h3 className="truncate text-sm font-semibold text-slate-950">
            {item.title}
          </h3>

          <p className="mt-1 truncate text-[11px] text-slate-400">
            /impact/stories/
            {item.slug}
          </p>

        </button>

        <div className="mt-3">

          {item.author ? (
            <span className="inline-flex max-w-full items-center rounded-full bg-[#F3EFE7] px-2.5 py-1 text-[10px] font-semibold text-[#94713F]">
              <span className="truncate">
                {item.author}
              </span>
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">
              No author specified
            </span>
          )}

        </div>

        <p className="mt-3 text-[10px] text-slate-400">
          Published{' '}
          {formatDate(
            item.published_at
          )}
        </p>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit3 size={13} />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${item.title}`}
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

export default function ImpactPage() {
  const router =
    useRouter()

  const supabase =
    createClient()

  /* ----------------------------------------------------------
     SECURITY
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

  const [projects, setProjects] =
    useState<Project[]>([])

  const [stories, setStories] =
    useState<Story[]>([])

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  /* ----------------------------------------------------------
     NAVIGATION
  ---------------------------------------------------------- */

  const [activeTab, setActiveTab] =
    useState<ActiveTab>(
      'projects'
    )

  /* ----------------------------------------------------------
     SEARCH / FILTERS
  ---------------------------------------------------------- */

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState<string>(
      'all'
    )

  const [showFilters, setShowFilters] =
    useState(false)

  /* ----------------------------------------------------------
     PAGINATION
  ---------------------------------------------------------- */

  const [page, setPage] =
    useState(1)

  /* ----------------------------------------------------------
     FEEDBACK
  ---------------------------------------------------------- */

  const [error, setError] =
    useState<string | null>(
      null
    )

  const [successMessage, setSuccessMessage] =
    useState<string | null>(
      null
    )

  /* ==========================================================
     ACCESS
  ========================================================== */

  const verifyAccess =
    useCallback(
      async () => {
        setCheckingAccess(
          true
        )

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
                'id, email, full_name, role'
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
     LOAD PROJECTS
  ========================================================== */

  const loadProjects =
    useCallback(
      async () => {
        const {
          data,
          error: queryError,
        } =
          await supabase
            .from(
              'impact_projects'
            )
            .select(
              `
                id,
                title,
                slug,
                location,
                status,
                description,
                cover_image_url,
                started_at,
                completed_at,
                created_at,
                updated_at
              `
            )
            .order(
              'created_at',
              {
                ascending:
                  false,
              }
            )

        if (
          queryError
        ) {
          console.error(
            'Impact projects query error:',
            queryError
          )

          throw new Error(
            'Unable to load impact projects.'
          )
        }

        setProjects(
          (data as Project[]) ??
            []
        )
      },
      [supabase]
    )

  /* ==========================================================
     LOAD STORIES
  ========================================================== */

  const loadStories =
    useCallback(
      async () => {
        const {
          data,
          error: queryError,
        } =
          await supabase
            .from(
              'impact_stories'
            )
            .select(
              `
                id,
                title,
                slug,
                author,
                status,
                content,
                excerpt,
                cover_image_url,
                published_at,
                created_at,
                updated_at
              `
            )
            .order(
              'created_at',
              {
                ascending:
                  false,
              }
            )

        if (
          queryError
        ) {
          console.error(
            'Impact stories query error:',
            queryError
          )

          throw new Error(
            'Unable to load impact stories.'
          )
        }

        setStories(
          (data as Story[]) ??
            []
        )
      },
      [supabase]
    )

  /* ==========================================================
     LOAD ALL
  ========================================================== */

  const loadAll =
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
          await Promise.all(
            [
              loadProjects(),
              loadStories(),
            ]
          )
        } catch (
          requestError
        ) {
          console.error(
            'Impact loading error:',
            requestError
          )

          setProjects(
            []
          )

          setStories(
            []
          )

          setError(
            requestError instanceof
            Error
              ? requestError.message
              : 'Unable to load impact data.'
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
        loadProjects,
        loadStories,
      ]
    )

  useEffect(() => {
    if (authorized) {
      loadAll()
    }
  }, [
    authorized,
    loadAll,
  ])

  /* ==========================================================
     FILTERED DATA
  ========================================================== */

  const filteredProjects =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase()

        let result =
          projects

        if (
          statusFilter !==
          'all'
        ) {
          result =
            result.filter(
              (
                project
              ) =>
                project.status ===
                statusFilter
            )
        }

        if (term) {
          result =
            result.filter(
              (
                project
              ) =>
                project.title
                  .toLowerCase()
                  .includes(
                    term
                  ) ||
                project.slug
                  .toLowerCase()
                  .includes(
                    term
                  ) ||
                (
                  project.location ??
                  ''
                )
                  .toLowerCase()
                  .includes(
                    term
                  ) ||
                (
                  project.description ??
                  ''
                )
                  .toLowerCase()
                  .includes(
                    term
                  )
            )
        }

        return result
      },
      [
        projects,
        search,
        statusFilter,
      ]
    )

  const filteredStories =
    useMemo(
      () => {
        const term =
          search
            .trim()
            .toLowerCase()

        let result =
          stories

        if (
          statusFilter !==
          'all'
        ) {
          result =
            result.filter(
              (
                story
              ) =>
                story.status ===
                statusFilter
            )
        }

        if (term) {
          result =
            result.filter(
              (
                story
              ) =>
                story.title
                  .toLowerCase()
                  .includes(
                    term
                  ) ||
                story.slug
                  .toLowerCase()
                  .includes(
                    term
                  ) ||
                (
                  story.author ??
                  ''
                )
                  .toLowerCase()
                  .includes(
                    term
                  ) ||
                (
                  story.excerpt ??
                  ''
                )
                  .toLowerCase()
                  .includes(
                    term
                  )
            )
        }

        return result
      },
      [
        stories,
        search,
        statusFilter,
      ]
    )

  const currentData =
    activeTab ===
    'projects'
      ? filteredProjects
      : filteredStories

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts =
    useMemo(
      () => ({
        projects:
          projects.length,

        stories:
          stories.length,

        publishedProjects:
          projects.filter(
            (
              item
            ) =>
              item.status ===
              'published'
          ).length,

        publishedStories:
          stories.filter(
            (
              item
            ) =>
              item.status ===
              'published'
          ).length,
      }),
      [
        projects,
        stories,
      ]
    )

  /* ==========================================================
     FILTER STATE
  ========================================================== */

  const hasActiveFilters =
    statusFilter !==
      'all' ||
    search.trim() !==
      ''

  const clearFilters =
    () => {
      setStatusFilter(
        'all'
      )

      setSearch('')

      setPage(1)
    }

  /* ==========================================================
     PAGINATION
  ========================================================== */

  useEffect(() => {
    setPage(1)
  }, [
    activeTab,
    search,
    statusFilter,
  ])

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        currentData.length /
          ITEMS_PER_PAGE
      )
    )

  const safePage =
    Math.min(
      page,
      totalPages
    )

  const paginatedData =
    useMemo(
      () => {
        const start =
          (safePage - 1) *
          ITEMS_PER_PAGE

        return currentData.slice(
          start,
          start +
            ITEMS_PER_PAGE
        )
      },
      [
        currentData,
        safePage,
      ]
    )

  const rangeStart =
    currentData.length ===
    0
      ? 0
      : (safePage - 1) *
          ITEMS_PER_PAGE +
        1

  const rangeEnd =
    Math.min(
      safePage *
        ITEMS_PER_PAGE,
      currentData.length
    )

  /* ==========================================================
     DELETE PROJECT
  ========================================================== */

  const handleDeleteProject =
    async (
      id: string
    ) => {
      const project =
        projects.find(
          (
            item
          ) =>
            item.id ===
            id
        )

      if (!project) {
        return
      }

      const confirmed =
        window.confirm(
          `Delete "${project.title}"?\n\nThis action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      setError(
        null
      )

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
              'role'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          profileError ||
          !currentProfile ||
          !AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is not authorized to delete impact projects.'
          )
        }

        const {
          error: deleteError,
        } =
          await supabase
            .from(
              'impact_projects'
            )
            .delete()
            .eq(
              'id',
              id
            )

        if (
          deleteError
        ) {
          throw new Error(
            deleteError.message ||
              'Unable to delete this project.'
          )
        }

        setProjects(
          (
            current
          ) =>
            current.filter(
              (
                item
              ) =>
                item.id !==
                id
            )
        )

        setSuccessMessage(
          `"${project.title}" was deleted successfully.`
        )
      } catch (
        deleteError
      ) {
        console.error(
          'Impact project deletion failed:',
          deleteError
        )

        setError(
          deleteError instanceof
          Error
            ? deleteError.message
            : 'Unable to delete this project.'
        )
      }
    }

  /* ==========================================================
     DELETE STORY
  ========================================================== */

  const handleDeleteStory =
    async (
      id: string
    ) => {
      const story =
        stories.find(
          (
            item
          ) =>
            item.id ===
            id
        )

      if (!story) {
        return
      }

      const confirmed =
        window.confirm(
          `Delete "${story.title}"?\n\nThis action cannot be undone.`
        )

      if (!confirmed) {
        return
      }

      setError(
        null
      )

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
              'role'
            )
            .eq(
              'id',
              user.id
            )
            .maybeSingle()

        if (
          profileError ||
          !currentProfile ||
          !AUTHORIZED_ROLES.includes(
            currentProfile.role as Role
          )
        ) {
          throw new Error(
            'Your current account is not authorized to delete impact stories.'
          )
        }

        const {
          error: deleteError,
        } =
          await supabase
            .from(
              'impact_stories'
            )
            .delete()
            .eq(
              'id',
              id
            )

        if (
          deleteError
        ) {
          throw new Error(
            deleteError.message ||
              'Unable to delete this story.'
          )
        }

        setStories(
          (
            current
          ) =>
            current.filter(
              (
                item
              ) =>
                item.id !==
                id
            )
        )

        setSuccessMessage(
          `"${story.title}" was deleted successfully.`
        )
      } catch (
        deleteError
      ) {
        console.error(
          'Impact story deletion failed:',
          deleteError
        )

        setError(
          deleteError instanceof
          Error
            ? deleteError.message
            : 'Unable to delete this story.'
        )
      }
    }

  /* ==========================================================
     CREATE ROUTE
  ========================================================== */

  const goToCreate =
    () => {
      router.push(
        activeTab ===
          'projects'
          ? '/admin/impact/projects/new'
          : '/admin/impact/stories/new'
      )
    }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (
    checkingAccess
  ) {
    return (
      <LoadingState />
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
            Your current role does not have permission to manage the Impact workspace.
          </p>

          {profile?.email && (
            <p className="mt-3 text-xs text-slate-400">
              Signed in as{' '}
              {profile.email}
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
            Impact
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
                  Impact
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                Community Impact
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage community projects and impact stories that represent the real-world actions of Barack Mining Investment.
              </p>

            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadAll(
                  true
                )
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
                goToCreate
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
            >
              <Plus size={16} />
              New{' '}
              {activeTab ===
              'projects'
                ? 'Project'
                : 'Story'}
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
            <AlertCircle size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              Impact operation failed
            </p>

            <p className="mt-1 whitespace-pre-line text-xs leading-5 text-red-700/80">
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

      {successMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
            <CheckCircle2 size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-emerald-800">
              Impact operation completed
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              {successMessage}
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage(
                null
              )
            }
            className="rounded-lg p-1 text-emerald-400 transition hover:bg-emerald-100 hover:text-emerald-700"
            aria-label="Dismiss success message"
          >
            <X size={15} />
          </button>

        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <button
          type="button"
          onClick={() => {
            setActiveTab(
              'projects'
            )
            clearFilters()
          }}
          className={`rounded-[20px] border p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 ${
            activeTab ===
            'projects'
              ? 'border-slate-300 bg-white'
              : 'border-slate-200/80 bg-white'
          }`}
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Projects
            </span>

            <Globe2
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {
              counts.projects
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Community initiatives
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab(
              'stories'
            )
            clearFilters()
          }}
          className={`rounded-[20px] border p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 ${
            activeTab ===
            'stories'
              ? 'border-slate-300 bg-white'
              : 'border-slate-200/80 bg-white'
          }`}
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Stories
            </span>

            <FileText
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {
              counts.stories
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Impact narratives
          </p>

        </button>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Published projects
            </span>

            <CheckCircle2
              size={16}
              className="text-emerald-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {
              counts.publishedProjects
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Publicly visible initiatives
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Published stories
            </span>

            <Users
              size={16}
              className="text-[#A98B4F]"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {
              counts.publishedStories
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Public impact stories
          </p>

        </div>

      </section>

      {/* ======================================================
          TABS
      ====================================================== */}

      <section className="rounded-[22px] border border-slate-200/80 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

        <div className="grid grid-cols-2 gap-1">

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                'projects'
              )
            }
            className={`flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${
              activeTab ===
              'projects'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe2 size={15} />
            Projects
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                'stories'
              )
            }
            className={`flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition ${
              activeTab ===
              'stories'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText size={15} />
            Stories
          </button>

        </div>

      </section>

      {/* ======================================================
          SEARCH / FILTERS
      ====================================================== */}

      <Section
        eyebrow="Impact register"
        title={
          activeTab ===
          'projects'
            ? 'Community projects'
            : 'Impact stories'
        }
        description={
          activeTab ===
          'projects'
            ? 'Manage the real community projects documented in the Impact workspace.'
            : 'Manage the editorial stories that explain the human impact of documented projects.'
        }
      >

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="relative flex-1">

            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                activeTab ===
                'projects'
                  ? 'Search title, slug, location...'
                  : 'Search title, slug, author...'
              }
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (
                    value
                  ) =>
                    !value
                )
              }
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition ${
                showFilters ||
                hasActiveFilters
                  ? 'border-slate-900 bg-slate-950 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
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
                    ].filter(
                      Boolean
                    ).length
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

        {showFilters && (
          <div className="mt-4 border-t border-slate-100 pt-4">

            <div className="max-w-md">

              <label
                htmlFor="impact-status-filter"
                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
              >
                Status
              </label>

              <select
                id="impact-status-filter"
                value={
                  statusFilter
                }
                onChange={(
                  event
                ) =>
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
                  statusFilter as ImpactStatus
                ]
              }`}
              onRemove={() =>
                setStatusFilter(
                  'all'
                )
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
            {
              currentData.length
            }{' '}
            {activeTab ===
            'projects'
              ? currentData.length ===
                1
                ? 'project'
                : 'projects'
              : currentData.length ===
                1
                ? 'story'
                : 'stories'}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {hasActiveFilters
              ? 'Matching your current criteria'
              : 'Complete impact register'}
          </p>

        </div>

        {currentData.length >
          0 && (
          <p className="text-xs text-slate-400">
            Showing {rangeStart}–
            {rangeEnd} of{' '}
            {currentData.length}
          </p>
        )}

      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      {loading ? (
        <div className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

          <div className="flex flex-col items-center justify-center px-5 py-10">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A0C0B]">

              <img
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                className="max-h-7 max-w-[35px] object-contain brightness-0 invert"
              />

            </div>

            <div className="mt-4 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            <p className="mt-3 text-xs font-semibold text-slate-700">
              Loading impact data
            </p>

          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">

            {Array.from({
              length: 6,
            }).map(
              (_, index) => (
                <div
                  key={
                    index
                  }
                  className="overflow-hidden rounded-[22px] border border-slate-100"
                >

                  <div className="aspect-[16/9] animate-pulse bg-slate-100" />

                  <div className="space-y-3 p-4">

                    <div className="h-4 animate-pulse rounded bg-slate-100" />

                    <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />

                    <div className="h-8 animate-pulse rounded-xl bg-slate-100" />

                  </div>
                </div>
              )
            )}

          </div>

        </div>
      ) : currentData.length ===
        0 ? (
        <EmptyState
          tab={
            activeTab
          }
          filtered={
            hasActiveFilters
          }
          onCreate={
            goToCreate
          }
          onClear={
            clearFilters
          }
        />
      ) : (
        <>
          {/* ==================================================
              DESKTOP TABLE
          ================================================== */}

          <section className="hidden overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)] md:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/60">

                  <tr>

                    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      {activeTab ===
                      'projects'
                        ? 'Project'
                        : 'Story'}
                    </th>

                    {activeTab ===
                      'projects' && (
                      <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                        Location
                      </th>
                    )}

                    {activeTab ===
                      'stories' && (
                      <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                        Author
                      </th>
                    )}

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Status
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {paginatedData.map(
                    (
                      item
                    ) => {
                      const isProject =
                        activeTab ===
                        'projects'

                      const project =
                        isProject
                          ? (item as Project)
                          : null

                      const story =
                        !isProject
                          ? (item as Story)
                          : null

                      const title =
                        isProject
                          ? project?.title ??
                            'Untitled project'
                          : story?.title ??
                            'Untitled story'

                      const slug =
                        isProject
                          ? project?.slug ??
                            ''
                          : story?.slug ??
                            ''

                      const status =
                        isProject
                          ? project?.status ??
                            'draft'
                          : story?.status ??
                            'draft'

                      const date =
                        isProject
                          ? project?.created_at
                          : story?.published_at ??
                            story?.created_at

                      return (
                        <tr
                          key={
                            item.id
                          }
                          onClick={() =>
                            router.push(
                              isProject
                                ? `/admin/impact/projects/${item.id}`
                                : `/admin/impact/stories/${item.id}`
                            )
                          }
                          className="group cursor-pointer transition hover:bg-slate-50/70"
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0A0C0B]">

                                <img
                                  src="/images/logo-bmi.png"
                                  alt=""
                                  aria-hidden="true"
                                  className="max-h-6 max-w-[30px] object-contain brightness-0 invert"
                                />

                              </div>

                              <div className="min-w-0">

                                <p className="max-w-[300px] truncate text-sm font-semibold text-slate-950">
                                  {title}
                                </p>

                                <p className="mt-1 max-w-[300px] truncate text-[11px] text-slate-400">
                                  /
                                  impact/
                                  {isProject
                                    ? 'projects'
                                    : 'stories'}
                                  /
                                  {slug}
                                </p>

                              </div>

                            </div>

                          </td>

                          {isProject ? (
                            <td className="px-4 py-4">

                              <p className="max-w-[220px] truncate text-sm text-slate-600">
                                {
                                  project?.location ??
                                  '—'
                                }
                              </p>

                            </td>
                          ) : (
                            <td className="px-4 py-4">

                              <p className="max-w-[180px] truncate text-sm text-slate-600">
                                {
                                  story?.author ??
                                  '—'
                                }
                              </p>

                            </td>
                          )}

                          <td className="px-4 py-4">

                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ring-1 ring-inset ${getStatusClass(
                                status
                              )}`}
                            >
                              {
                                STATUS_LABELS[
                                  status
                                ]
                              }
                            </span>

                          </td>

                          <td className="px-4 py-4">

                            <div>

                              <p className="text-sm font-medium text-slate-700">
                                {formatDate(
                                  date
                                )}
                              </p>

                              <p className="mt-0.5 text-[10px] text-slate-400">
                                {formatRelativeDate(
                                  date
                                )}
                              </p>

                            </div>

                          </td>

                          <td className="px-5 py-4 text-right">

                            <div className="flex items-center justify-end gap-1.5">

                              <button
                                type="button"
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation()

                                  router.push(
                                    isProject
                                      ? `/admin/impact/projects/${item.id}`
                                      : `/admin/impact/stories/${item.id}`
                                  )
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
                                aria-label={`Edit ${title}`}
                              >
                                <Edit3
                                  size={
                                    15
                                  }
                                />
                              </button>

                              <button
                                type="button"
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation()

                                  if (
                                    isProject
                                  ) {
                                    handleDeleteProject(
                                      item.id
                                    )
                                  } else {
                                    handleDeleteStory(
                                      item.id
                                    )
                                  }
                                }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                aria-label={`Delete ${title}`}
                              >
                                <Trash2
                                  size={
                                    15
                                  }
                                />
                              </button>

                              <div className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition group-hover:bg-slate-100 group-hover:text-slate-700">
                                <ArrowRight
                                  size={
                                    15
                                  }
                                />
                              </div>

                            </div>

                          </td>

                        </tr>
                      )
                    }
                  )}

                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">

              <p className="text-xs text-slate-400">

                Showing{' '}

                <span className="font-semibold text-slate-600">
                  {rangeStart}
                </span>

                {' '}to{' '}

                <span className="font-semibold text-slate-600">
                  {rangeEnd}
                </span>

                {' '}of{' '}

                <span className="font-semibold text-slate-600">
                  {
                    currentData.length
                  }
                </span>

              </p>

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  disabled={
                    safePage <=
                    1
                  }
                  onClick={() =>
                    setPage(
                      (
                        value
                      ) =>
                        Math.max(
                          1,
                          value -
                            1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft
                    size={
                      15
                    }
                  />
                </button>

                <div className="px-3 text-xs font-semibold text-slate-600">
                  {
                    safePage
                  }{' '}
                  /{' '}
                  {
                    totalPages
                  }
                </div>

                <button
                  type="button"
                  disabled={
                    safePage >=
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (
                        value
                      ) =>
                        Math.min(
                          totalPages,
                          value +
                            1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight
                    size={
                      15
                    }
                  />
                </button>

              </div>
            </div>

          </section>

          {/* ==================================================
              MOBILE
          ================================================== */}

          <section className="space-y-3 md:hidden">

            {paginatedData.map(
              (
                item
              ) =>
                activeTab ===
                'projects' ? (
                  <ProjectCard
                    key={
                      item.id
                    }
                    item={
                      item as Project
                    }
                    onOpen={() =>
                      router.push(
                        `/admin/impact/projects/${item.id}`
                      )
                    }
                    onDelete={() =>
                      handleDeleteProject(
                        item.id
                      )
                    }
                  />
                ) : (
                  <StoryCard
                    key={
                      item.id
                    }
                    item={
                      item as Story
                    }
                    onOpen={() =>
                      router.push(
                        `/admin/impact/stories/${item.id}`
                      )
                    }
                    onDelete={() =>
                      handleDeleteStory(
                        item.id
                      )
                    }
                  />
                )
            )}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">

              <button
                type="button"
                disabled={
                  safePage <=
                  1
                }
                onClick={() =>
                  setPage(
                    (
                      value
                    ) =>
                      Math.max(
                        1,
                        value -
                          1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={
                    16
                  }
                />
              </button>

              <span className="text-xs font-semibold text-slate-600">
                Page{' '}
                {
                  safePage
                }{' '}
                of{' '}
                {
                  totalPages
                }
              </span>

              <button
                type="button"
                disabled={
                  safePage >=
                  totalPages
                }
                onClick={() =>
                  setPage(
                    (
                      value
                    ) =>
                      Math.min(
                        totalPages,
                        value +
                          1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={
                    16
                  }
                />
              </button>

            </div>

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
              Protected Impact workspace
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
              Impact management is controlled by authenticated roles and Supabase RLS policies.
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
          onClick={
            goToCreate
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.14)] transition hover:bg-slate-800"
        >
          <Plus size={14} />
          New{' '}
          {activeTab ===
          'projects'
            ? 'Project'
            : 'Story'}
        </button>

      </div>

    </div>
  )
}