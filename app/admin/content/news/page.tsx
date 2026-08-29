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
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Category =
  | 'corporate'
  | 'operations'
  | 'projects'
  | 'communities'
  | 'partnerships'

type Status =
  | 'draft'
  | 'review'
  | 'published'
  | 'archived'

type Role =
  | 'super_admin'
  | 'admin'
  | 'opportunity_manager'
  | 'content_manager'
  | 'operations_manager'
  | 'viewer'

type NewsItem = {
  id: string
  title: string
  slug: string
  category: Category
  status: Status
  published_at: string | null
  created_at: string
}

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: Role
}

/* ============================================================
   CONSTANTS
============================================================ */

const CATEGORY_LABELS: Record<
  Category,
  string
> = {
  corporate: 'Corporate',
  operations: 'Operations',
  projects: 'Projects',
  communities: 'Communities',
  partnerships: 'Partnerships',
}

const STATUS_LABELS: Record<
  Status,
  string
> = {
  draft: 'Draft',
  review: 'In Review',
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

const CATEGORY_OPTIONS = Object.entries(
  CATEGORY_LABELS
).map(
  ([value, label]) => ({
    value,
    label,
  })
)

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'content_manager',
]

const ITEMS_PER_PAGE = 10

/* ============================================================
   HELPERS
============================================================ */

function getStatusClass(
  status: Status
) {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-600 ring-slate-500/10'

    case 'review':
      return 'bg-amber-50 text-amber-700 ring-amber-600/10'

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
    Number.isNaN(timestamp)
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

function getInitials(
  name: string | null | undefined
) {
  const source =
    name?.trim() ||
    'BMI'

  const parts =
    source
      .split(/\s+/)
      .filter(Boolean)

  if (
    parts.length === 0
  ) {
    return 'BM'
  }

  if (
    parts.length === 1
  ) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
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
          Preparing secure content workspace
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading the news register...
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
          ? 'No matching articles'
          : 'No articles yet'}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {filtered
          ? 'No article matches the current search or filters.'
          : 'There are currently no articles in the Content workspace.'}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">

        {filtered && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X size={14} />
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
            New Article
          </button>
        )}

      </div>
    </div>
  )
}

/* ============================================================
   MOBILE CARD
============================================================ */

function NewsCard({
  item,
  onEdit,
  onDelete,
}: {
  item: NewsItem
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0A0C0B] text-white">
          <img
            src="/images/logo-bmi.png"
            alt=""
            aria-hidden="true"
            className="max-h-6 max-w-[30px] object-contain brightness-0 invert"
          />
        </div>

        <div className="min-w-0 flex-1">

          <button
            type="button"
            onClick={onEdit}
            className="block max-w-full text-left"
          >

            <p className="truncate text-sm font-semibold text-slate-950">
              {item.title}
            </p>

            <p className="mt-1 truncate text-[11px] text-slate-400">
              /news/{item.slug}
            </p>

          </button>

          <div className="mt-3 flex flex-wrap gap-2">

            <span className="inline-flex rounded-full bg-[#F3EFE7] px-2.5 py-1 text-[10px] font-semibold text-[#94713F]">
              {CATEGORY_LABELS[item.category]}
            </span>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ring-1 ring-inset ${getStatusClass(
                item.status
              )}`}
            >
              {STATUS_LABELS[item.status]}
            </span>

          </div>

        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Published
          </p>

          <p className="mt-1 text-xs font-medium text-slate-700">
            {formatDate(
              item.published_at
            )}
          </p>

        </div>

        <div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Created
          </p>

          <p className="mt-1 text-xs font-medium text-slate-700">
            {formatRelativeDate(
              item.created_at
            )}
          </p>

        </div>

      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
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
    </article>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function NewsListPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     SECURITY
  ---------------------------------------------------------- */

  const [profile, setProfile] =
    useState<Profile | null>(null)

  const [authorized, setAuthorized] =
    useState(false)

  const [authChecking, setAuthChecking] =
    useState(true)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [news, setNews] =
    useState<NewsItem[]>([])

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

  const [showFilters, setShowFilters] =
    useState(false)

  /* ----------------------------------------------------------
     PAGINATION
  ---------------------------------------------------------- */

  const [page, setPage] =
    useState(1)

  /* ==========================================================
     ACCESS
  ========================================================== */

  const verifyAccess =
    useCallback(
      async () => {
        setAuthChecking(true)

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
        } catch (
          accessError
        ) {
          console.error(
            'Access verification error:',
            accessError
          )

          router.replace('/login')
        } finally {
          setAuthChecking(
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
            event ===
              'SIGNED_OUT' ||
            !session?.user
          ) {
            router.replace('/login')
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
     LOAD NEWS
  ========================================================== */

  const loadNews =
    useCallback(
      async (
        isRefresh = false
      ) => {
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
              .from('news')
              .select(
                `
                  id,
                  title,
                  slug,
                  category,
                  status,
                  published_at,
                  created_at
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
            statusFilter !==
            'all'
          ) {
            query =
              query.eq(
                'status',
                statusFilter
              )
          }

          if (
            categoryFilter !==
            'all'
          ) {
            query =
              query.eq(
                'category',
                categoryFilter
              )
          }

          const {
            data,
            error: queryError,
          } =
            await query

          if (queryError) {
            console.error(
              'News query error:',
              queryError
            )

            setNews([])

            setError(
              'Unable to load articles. Please check your permissions and try again.'
            )

            return
          }

          setNews(
            (data as NewsItem[]) ??
              []
          )
        } catch (
          requestError
        ) {
          console.error(
            'News request error:',
            requestError
          )

          setNews([])

          setError(
            'An unexpected error occurred while loading articles.'
          )
        } finally {
          setLoading(false)
          setRefreshing(false)
        }
      },
      [
        authorized,
        categoryFilter,
        statusFilter,
        supabase,
      ]
    )

  useEffect(() => {
    if (authorized) {
      loadNews()
    }
  }, [
    authorized,
    loadNews,
  ])

  /* ==========================================================
     SEARCH
  ========================================================== */

  const filteredNews =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return news
      }

      return news.filter(
        (item) =>
          item.title
            .toLowerCase()
            .includes(term) ||
          item.slug
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
            .includes(term)
      )
    }, [
      news,
      search,
    ])

  /* ==========================================================
     RESET PAGE
  ========================================================== */

  useEffect(() => {
    setPage(1)
  }, [
    search,
    statusFilter,
    categoryFilter,
  ])

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredNews.length /
          ITEMS_PER_PAGE
      )
    )

  const safePage =
    Math.min(
      page,
      totalPages
    )

  const paginatedNews =
    useMemo(() => {
      const start =
        (safePage - 1) *
        ITEMS_PER_PAGE

      return filteredNews.slice(
        start,
        start +
          ITEMS_PER_PAGE
      )
    }, [
      filteredNews,
      safePage,
    ])

  const rangeStart =
    filteredNews.length ===
    0
      ? 0
      : (safePage - 1) *
          ITEMS_PER_PAGE +
        1

  const rangeEnd =
    Math.min(
      safePage *
        ITEMS_PER_PAGE,
      filteredNews.length
    )

  /* ==========================================================
     COUNTS
  ========================================================== */

  const counts =
    useMemo(
      () => ({
        total: news.length,

        published:
          news.filter(
            (item) =>
              item.status ===
              'published'
          ).length,

        drafts:
          news.filter(
            (item) =>
              item.status ===
              'draft'
          ).length,

        review:
          news.filter(
            (item) =>
              item.status ===
              'review'
          ).length,
      }),
      [news]
    )

  /* ==========================================================
     FILTER STATE
  ========================================================== */

  const hasActiveFilters =
    statusFilter !==
      'all' ||
    categoryFilter !==
      'all' ||
    search.trim() !==
      ''

  const clearFilters =
    () => {
      setStatusFilter(
        'all'
      )

      setCategoryFilter(
        'all'
      )

      setSearch('')

      setPage(1)
    }

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete =
    async (
      id: string
    ) => {
      const article =
        news.find(
          (item) =>
            item.id === id
        )

      if (!article) {
        return
      }

      const confirmed =
        window.confirm(
          `Delete "${article.title}"?\n\nThis action cannot be undone.`
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
            'Your current account is not authorized to delete content.'
          )
        }

        const {
          error: deleteError,
        } =
          await supabase
            .from('news')
            .delete()
            .eq(
              'id',
              id
            )

        if (deleteError) {
          console.error(
            'News deletion error:',
            deleteError
          )

          throw new Error(
            deleteError.message ||
              'Unable to delete this article.'
          )
        }

        setNews(
          (current) =>
            current.filter(
              (item) =>
                item.id !== id
            )
        )
      } catch (
        deleteError
      ) {
        console.error(
          'News deletion failed:',
          deleteError
        )

        setError(
          deleteError instanceof
          Error
            ? deleteError.message
            : 'Unable to delete this article.'
        )
      }
    }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (authChecking) {
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
            Your current role does not have permission to manage website content.
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
          HEADER
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
            News
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
                  Content
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                News & Articles
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the editorial content published through the Barack Mining Investment public website.
              </p>

            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadNews(true)
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
                  '/admin/content/news/new'
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
            >
              <Plus size={16} />
              New Article
            </button>

          </div>
        </div>
      </section>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

        <button
          type="button"
          onClick={clearFilters}
          className="rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Total
            </span>

            <FileText
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.total}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            All articles
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter(
              'published'
            )
            setCategoryFilter(
              'all'
            )
            setSearch('')
          }}
          className="rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Published
            </span>

            <CheckCircle2
              size={16}
              className="text-emerald-500"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.published}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Live public content
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter(
              'draft'
            )
            setCategoryFilter(
              'all'
            )
            setSearch('')
          }}
          className="rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Drafts
            </span>

            <FileText
              size={16}
              className="text-slate-400"
            />

          </div>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            {counts.drafts}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Editorial work in progress
          </p>

        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter(
              'review'
            )
            setCategoryFilter(
              'all'
            )
            setSearch('')
          }}
          className="rounded-[20px] border border-slate-200/80 bg-white p-4 text-left shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-slate-300"
        >

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              In review
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
            Awaiting editorial validation
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
            aria-label="Dismiss error"
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
        title="Article register"
        description="Search and filter the editorial content currently managed in the workspace."
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
              placeholder="Search title, slug, category or status..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />

          </div>

          <button
            type="button"
            onClick={() =>
              setShowFilters(
                (value) =>
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
                    categoryFilter !==
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

        {showFilters && (
          <div className="mt-4 border-t border-slate-100 pt-4">

            <div className="grid gap-4 sm:grid-cols-2">

              <div>

                <label
                  htmlFor="news-status-filter"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Status
                </label>

                <select
                  id="news-status-filter"
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

              <div>

                <label
                  htmlFor="news-category-filter"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Category
                </label>

                <select
                  id="news-category-filter"
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
                  statusFilter as Status
                ]
              }`}
              onRemove={() =>
                setStatusFilter(
                  'all'
                )
              }
            />
          )}

          {categoryFilter !==
            'all' && (
            <FilterBadge
              label={`Category: ${
                CATEGORY_LABELS[
                  categoryFilter as Category
                ]
              }`}
              onRemove={() =>
                setCategoryFilter(
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
            {filteredNews.length}{' '}
            {filteredNews.length ===
            1
              ? 'article'
              : 'articles'}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {hasActiveFilters
              ? 'Matching your current criteria'
              : 'Complete editorial register'}
          </p>

        </div>

        {filteredNews.length >
          0 && (
          <p className="text-xs text-slate-400">
            Showing {rangeStart}–
            {rangeEnd} of{' '}
            {filteredNews.length}
          </p>
        )}

      </div>

      {/* ======================================================
          LOADING
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
              Loading articles
            </p>

          </div>

          <div className="hidden md:block">

            <div className="border-b border-slate-100 px-5 py-4">

              <div className="grid grid-cols-5 gap-4">

                {Array.from({
                  length: 5,
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
                  key={index}
                  className="h-40 animate-pulse rounded-2xl bg-slate-100"
                />
              )
            )}

          </div>

        </div>
      ) : filteredNews.length ===
        0 ? (
        <EmptyState
          filtered={
            hasActiveFilters
          }
          onCreate={() =>
            router.push(
              '/admin/content/news/new'
            )
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
                      Article
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Category
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Status
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Published
                    </th>

                    <th className="px-4 py-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Created
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {paginatedNews.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                        className="group transition hover:bg-slate-50/70"
                      >

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/admin/content/news/${item.id}`
                              )
                            }
                            className="flex items-center gap-3 text-left"
                          >

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0A0C0B]">

                              <img
                                src="/images/logo-bmi.png"
                                alt=""
                                aria-hidden="true"
                                className="max-h-6 max-w-[30px] object-contain brightness-0 invert"
                              />

                            </div>

                            <div className="min-w-0">

                              <p className="max-w-[290px] truncate text-sm font-semibold text-slate-950">
                                {
                                  item.title
                                }
                              </p>

                              <p className="mt-1 max-w-[290px] truncate text-[11px] text-slate-400">
                                /news/
                                {
                                  item.slug
                                }
                              </p>

                            </div>
                          </button>
                        </td>

                        <td className="px-4 py-4">

                          <span className="inline-flex rounded-full bg-[#F3EFE7] px-2.5 py-1 text-[10px] font-semibold text-[#94713F]">
                            {
                              CATEGORY_LABELS[
                                item.category
                              ]
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ring-1 ring-inset ${getStatusClass(
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

                          <div>

                            <p className="text-sm font-medium text-slate-700">
                              {
                                formatDate(
                                  item.published_at
                                )
                              }
                            </p>

                            {item.published_at && (
                              <p className="mt-0.5 text-[10px] text-slate-400">
                                Published
                              </p>
                            )}

                          </div>

                        </td>

                        <td className="px-4 py-4">

                          <div>

                            <p className="text-sm font-medium text-slate-700">
                              {
                                formatDate(
                                  item.created_at
                                )
                              }
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {
                                formatRelativeDate(
                                  item.created_at
                                )
                              }
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-right">

                          <div className="flex items-center justify-end gap-1.5">

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/admin/content/news/${item.id}`
                                )
                              }
                              aria-label={`Edit ${item.title}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-slate-200 hover:bg-white hover:text-slate-700"
                            >
                              <Edit3
                                size={
                                  15
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                              aria-label={`Delete ${item.title}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2
                                size={
                                  15
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                router.push(
                                  `/admin/content/news/${item.id}`
                                )
                              }
                              aria-label={`Open ${item.title}`}
                              className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <ArrowRight
                                size={
                                  15
                                }
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

            {/* ==================================================
                DESKTOP PAGINATION
            ================================================== */}

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
                    filteredNews.length
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
                      (value) =>
                        Math.max(
                          1,
                          value - 1
                        )
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                >
                  <ChevronRight
                    size={15}
                  />
                </button>

              </div>
            </div>
          </section>

          {/* ==================================================
              MOBILE
          ================================================== */}

          <section className="space-y-3 md:hidden">

            {paginatedNews.map(
              (item) => (
                <NewsCard
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  onEdit={() =>
                    router.push(
                      `/admin/content/news/${item.id}`
                    )
                  }
                  onDelete={() =>
                    handleDelete(
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
                    (value) =>
                      Math.max(
                        1,
                        value - 1
                      )
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={16}
                />
              </button>

            </div>
          </section>
        </>
      )}

      {/* ======================================================
          SECURITY FOOTNOTE
      ====================================================== */}

      <section className="flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck
              size={16}
            />
          </div>

          <div>

            <p className="text-xs font-semibold text-slate-800">
              Protected content workspace
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
              News management is controlled by authenticated roles and Supabase RLS policies.
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
              '/admin/content'
            )
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <FileText size={14} />
          Content workspace
        </button>

      </div>

    </div>
  )
}