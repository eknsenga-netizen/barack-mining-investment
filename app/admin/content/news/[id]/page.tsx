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
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe2,
  Save,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
  X,
} from 'lucide-react'

import { useRouter, useParams } from 'next/navigation'
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

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: Role
}

type NewsRecord = {
  id: string
  title: string | null
  slug: string | null
  category: Category | null
  status: Status | null
  content: string | null
  excerpt: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
  updated_at: string | null
}

/* ============================================================
   OPTIONS
============================================================ */

const CATEGORY_OPTIONS: {
  value: Category
  label: string
  description: string
}[] = [
  {
    value: 'corporate',
    label: 'Corporate',
    description:
      'Company news, milestones and institutional updates.',
  },
  {
    value: 'operations',
    label: 'Operations',
    description:
      'Operational activities, field work and developments.',
  },
  {
    value: 'projects',
    label: 'Projects',
    description:
      'Projects, initiatives and major business activities.',
  },
  {
    value: 'communities',
    label: 'Communities',
    description:
      'Community engagement, social impact and local initiatives.',
  },
  {
    value: 'partnerships',
    label: 'Partnerships',
    description:
      'Strategic partnerships, collaborations and announcements.',
  },
]

const STATUS_OPTIONS: {
  value: Status
  label: string
  description: string
}[] = [
  {
    value: 'draft',
    label: 'Draft',
    description:
      'Work in progress and not publicly visible.',
  },
  {
    value: 'review',
    label: 'In Review',
    description:
      'Ready for editorial validation.',
  },
  {
    value: 'published',
    label: 'Published',
    description:
      'Visible on the public website.',
  },
  {
    value: 'archived',
    label: 'Archived',
    description:
      'Retained internally and no longer active.',
  },
]

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
  'content_manager',
]

/* ============================================================
   HELPERS
============================================================ */

function generateSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      '')
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

function formatDateTime(
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
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(date)
}

function getStatusClass(
  status: Status
) {
  switch (status) {
    case 'draft':
      return 'bg-slate-100 text-slate-600'

    case 'review':
      return 'bg-amber-50 text-amber-700'

    case 'published':
      return 'bg-emerald-50 text-emerald-700'

    case 'archived':
      return 'bg-slate-100 text-slate-400'

    default:
      return 'bg-slate-50 text-slate-600'
  }
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">
          {label}

          {required && (
            <span className="ml-1 text-[#A96F35]">
              *
            </span>
          )}
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
   SECTION
============================================================ */

function FormSection({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">

        <div className="flex items-start gap-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A0C0B] text-[10px] font-bold tracking-[0.12em] text-white">
            {number}
          </div>

          <div>

            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A98B4F]">
              {eyebrow}
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
              {title}
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
              {description}
            </p>

          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {children}
      </div>
    </section>
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
          Preparing secure editor
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Verifying access and loading the article...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const supabase = createClient()

  /* ----------------------------------------------------------
     ACCESS
  ---------------------------------------------------------- */

  const [authorized, setAuthorized] =
    useState(false)

  const [checkingAccess, setCheckingAccess] =
    useState(true)

  const [profile, setProfile] =
    useState<Profile | null>(null)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [deleting, setDeleting] =
    useState(false)

  const [article, setArticle] =
    useState<NewsRecord | null>(null)

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [title, setTitle] =
    useState('')

  const [slug, setSlug] =
    useState('')

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false)

  const [category, setCategory] =
    useState<Category>('corporate')

  const [status, setStatus] =
    useState<Status>('draft')

  const [content, setContent] =
    useState('')

  const [excerpt, setExcerpt] =
    useState('')

  const [coverImage, setCoverImage] =
    useState('')

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState(false)

  /* ==========================================================
     ACCESS CHECK
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
     LOAD ARTICLE
  ========================================================== */

  const loadArticle = useCallback(
    async () => {
      if (!authorized) {
        return
      }

      setLoading(true)
      setError(null)

      try {
        const {
          data,
          error: queryError,
        } =
          await supabase
            .from('news')
            .select(
              `
                id,
                title,
                slug,
                category,
                status,
                content,
                excerpt,
                cover_image_url,
                published_at,
                created_at,
                updated_at
              `
            )
            .eq(
              'id',
              id
            )
            .maybeSingle()

        if (queryError) {
          console.error(
            'Article loading error:',
            queryError
          )

          setError(
            'Unable to load this article.'
          )

          return
        }

        if (!data) {
          setError(
            'This article could not be found.'
          )

          return
        }

        const typedArticle =
          data as NewsRecord

        setArticle(
          typedArticle
        )

        setTitle(
          typedArticle.title ??
            ''
        )

        setSlug(
          typedArticle.slug ??
            ''
        )

        setCategory(
          typedArticle.category ??
            'corporate'
        )

        setStatus(
          typedArticle.status ??
            'draft'
        )

        setContent(
          typedArticle.content ??
            ''
        )

        setExcerpt(
          typedArticle.excerpt ??
            ''
        )

        setCoverImage(
          typedArticle.cover_image_url ??
            ''
        )
      } catch (loadError) {
        console.error(
          'Article detail error:',
          loadError
        )

        setError(
          'An unexpected error occurred while loading this article.'
        )
      } finally {
        setLoading(false)
      }
    },
    [authorized, id, supabase]
  )

  useEffect(() => {
    if (authorized) {
      loadArticle()
    }
  }, [
    authorized,
    loadArticle,
  ])

  /* ==========================================================
     TITLE / SLUG
  ========================================================== */

  const handleTitleChange = (
    value: string
  ) => {
    setTitle(value)

    if (!slugManuallyEdited) {
      setSlug(
        generateSlug(value)
      )
    }
  }

  const handleSlugChange = (
    value: string
  ) => {
    setSlug(
      generateSlug(value)
    )

    setSlugManuallyEdited(
      true
    )
  }

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm = () => {
    const cleanTitle =
      title.trim()

    const cleanSlug =
      slug.trim()

    const cleanContent =
      content.trim()

    if (!cleanTitle) {
      return 'The article title is required.'
    }

    if (!cleanSlug) {
      return 'The article slug is required.'
    }

    if (!cleanContent) {
      return 'The article content is required.'
    }

    if (cleanTitle.length > 250) {
      return 'The article title is too long.'
    }

    if (cleanSlug.length > 250) {
      return 'The article slug is too long.'
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        cleanSlug
      )
    ) {
      return 'The slug may only contain lowercase letters, numbers and hyphens.'
    }

    if (
      excerpt.trim().length >
      5000
    ) {
      return 'The excerpt is too long.'
    }

    if (coverImage.trim()) {
      try {
        new URL(
          coverImage.trim()
        )
      } catch {
        return 'The cover image URL is not valid.'
      }
    }

    return null
  }

  /* ==========================================================
     SAVE
  ========================================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (
      saving ||
      deleting ||
      !authorized ||
      !article
    ) {
      return
    }

    setError(null)
    setSuccess(false)

    const validationError =
      validateForm()

    if (validationError) {
      setError(
        validationError
      )
      return
    }

    setSaving(true)

    try {
      /* ------------------------------------------------------
         Re-check authenticated user
      ------------------------------------------------------ */

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

      /* ------------------------------------------------------
         Re-check authorization
      ------------------------------------------------------ */

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
        !currentProfile ||
        !AUTHORIZED_ROLES.includes(
          currentProfile.role as Role
        )
      ) {
        throw new Error(
          'Your current account is not authorized to modify content.'
        )
      }

      /* ------------------------------------------------------
         Published timestamp handling
      ------------------------------------------------------ */

      let nextPublishedAt =
        article.published_at

      if (
        status === 'published' &&
        !article.published_at
      ) {
        nextPublishedAt =
          new Date().toISOString()
      }

      if (
        status !== 'published'
      ) {
        nextPublishedAt =
          null
      }

      /* ------------------------------------------------------
         Update article
      ------------------------------------------------------ */

      const {
        error: updateError,
      } =
        await supabase
          .from('news')
          .update({
            title:
              title.trim(),
            slug:
              slug.trim(),
            category,
            status,
            content:
              content.trim(),
            excerpt:
              excerpt.trim() ||
              null,
            cover_image_url:
              coverImage.trim() ||
              null,
            published_at:
              nextPublishedAt,
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            'id',
            id
          )

      if (updateError) {
        console.error(
          'News update error:',
          updateError
        )

        if (
          updateError.code ===
          '23505'
        ) {
          throw new Error(
            'This slug already exists. Please choose another one.'
          )
        }

        throw new Error(
          updateError.message ||
            'Unable to update this article.'
        )
      }

      setArticle(
        (current) =>
          current
            ? {
                ...current,
                title:
                  title.trim(),
                slug:
                  slug.trim(),
                category,
                status,
                content:
                  content.trim(),
                excerpt:
                  excerpt.trim() ||
                  null,
                cover_image_url:
                  coverImage.trim() ||
                  null,
                published_at:
                  nextPublishedAt,
                updated_at:
                  new Date().toISOString(),
              }
            : current
      )

      setSuccess(true)

      window.setTimeout(() => {
        router.push(
          '/admin/content/news'
        )
      }, 1500)
    } catch (saveError) {
      console.error(
        'News update failed:',
        saveError
      )

      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update this article.'
      )
    } finally {
      setSaving(false)
    }
  }

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = async () => {
    if (
      deleting ||
      saving ||
      !authorized ||
      !article
    ) {
      return
    }

    const confirmed =
      window.confirm(
        `Delete "${article.title ?? 'this article'}"?\n\nThis action cannot be undone.`
      )

    if (!confirmed) {
      return
    }

    setDeleting(true)
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
          .select(
            'role'
          )
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

      router.push(
        '/admin/content/news'
      )
    } catch (deleteError) {
      console.error(
        'News deletion failed:',
        deleteError
      )

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete this article.'
      )
    } finally {
      setDeleting(false)
    }
  }

  /* ==========================================================
     DERIVED
  ========================================================== */

  const selectedCategory =
    useMemo(
      () =>
        CATEGORY_OPTIONS.find(
          (item) =>
            item.value ===
            category
        ),
      [category]
    )

  const selectedStatus =
    useMemo(
      () =>
        STATUS_OPTIONS.find(
          (item) =>
            item.value ===
            status
        ),
      [status]
    )

  const previewTitle =
    title.trim() ||
    'Article'

  const previewSlug =
    slug.trim() ||
    'article-slug'

  /* ==========================================================
     LOADING / ERROR
  ========================================================== */

  if (
    checkingAccess ||
    loading
  ) {
    return <LoadingState />
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
            Your current role does not have permission to edit website content.
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

  if (
    error &&
    !article
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-xl rounded-[28px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <FileText size={23} />
          </div>

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.3em] text-red-600">
            Content record
          </p>

          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            Article unavailable
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/news'
              )
            }
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to News
          </button>

        </div>
      </div>
    )
  }

  if (!article) {
    return <LoadingState />
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
                '/admin/content/news'
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

          <button
            type="button"
            onClick={() =>
              router.push(
                '/admin/content/news'
              )
            }
            className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
          >
            News
          </button>

          <span className="text-slate-300">
            /
          </span>

          <span className="max-w-[260px] truncate text-xs font-semibold text-slate-700">
            {previewTitle}
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
                  Edit article
                </span>

                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-[9px] font-bold uppercase tracking-[0.18em] ${getStatusClass(
                    status
                  )}`}
                >
                  {selectedStatus?.label}
                </span>

                <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Protected workspace
                </span>

              </div>

              <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                {previewTitle}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Article record · Created{' '}
                {formatDate(
                  article.created_at
                )}
              </p>

            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              deleting ||
              saving
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} />

            {deleting
              ? 'Deleting...'
              : 'Delete Article'}
          </button>

        </div>
      </section>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
            <ShieldAlert size={17} />
          </div>

          <div className="min-w-0 flex-1">

            <p className="text-sm font-semibold text-red-800">
              We could not complete the request
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

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
            <CheckCircle2 size={17} />
          </div>

          <div>

            <p className="text-sm font-semibold text-emerald-800">
              Article updated successfully
            </p>

            <p className="mt-1 text-xs leading-5 text-emerald-700/80">
              Your changes have been saved. Returning to the news register...
            </p>

          </div>
        </div>
      )}

      {/* ======================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ====================================================
            01 ARTICLE
        ==================================================== */}

        <FormSection
          number="01"
          eyebrow="Article"
          title="Article information"
          description="Update the title, public URL, category and publication status."
        >

          <div className="space-y-6">

            <Field
              label="Title"
              required
              hint={`${title.length}/250`}
            >

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                maxLength={250}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                required
              />

            </Field>

            <Field
              label="Slug"
              required
              hint="Public URL"
            >

              <div className="relative">

                <Globe2
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    handleSlugChange(
                      event.target.value
                    )
                  }
                  maxLength={250}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                  required
                />

              </div>

              <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">

                <span>
                  /news/
                  <span className="font-medium text-slate-600">
                    {previewSlug}
                  </span>
                </span>

                {slugManuallyEdited && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(
                        generateSlug(
                          title
                        )
                      )
                      setSlugManuallyEdited(
                        false
                      )
                    }}
                    className="font-semibold text-[#A96F35] hover:underline"
                  >
                    Regenerate
                  </button>
                )}

              </div>

            </Field>

            <div className="grid gap-6 lg:grid-cols-2">

              <Field
                label="Category"
                required
              >

                <div className="space-y-2">

                  {CATEGORY_OPTIONS.map(
                    (option) => {
                      const selected =
                        category ===
                        option.value

                      return (
                        <button
                          type="button"
                          key={
                            option.value
                          }
                          onClick={() =>
                            setCategory(
                              option.value
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? 'border-slate-950 bg-slate-950 text-white shadow-[0_8px_25px_rgba(10,12,11,0.10)]'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                selected
                                  ? 'bg-white/10'
                                  : 'bg-slate-100'
                              }`}
                            >
                              <Tag size={14} />
                            </div>

                            <div>

                              <p className="text-xs font-semibold">
                                {
                                  option.label
                                }
                              </p>

                              <p
                                className={`mt-0.5 text-[10px] ${
                                  selected
                                    ? 'text-white/50'
                                    : 'text-slate-400'
                                }`}
                              >
                                {
                                  option.description
                                }
                              </p>

                            </div>

                          </div>

                          {selected && (
                            <Check
                              size={15}
                              className="text-[#D0A765]"
                            />
                          )}

                        </button>
                      )
                    }
                  )}

                </div>
              </Field>

              <Field
                label="Status"
                required
              >

                <div className="space-y-2">

                  {STATUS_OPTIONS.map(
                    (option) => {
                      const selected =
                        status ===
                        option.value

                      return (
                        <button
                          type="button"
                          key={
                            option.value
                          }
                          onClick={() =>
                            setStatus(
                              option.value
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                            selected
                              ? 'border-slate-950 bg-slate-950 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >

                          <div>

                            <p className="text-xs font-semibold">
                              {
                                option.label
                              }
                            </p>

                            <p
                              className={`mt-0.5 text-[10px] ${
                                selected
                                  ? 'text-white/50'
                                  : 'text-slate-400'
                              }`}
                            >
                              {
                                option.description
                              }
                            </p>

                          </div>

                          {selected && (
                            <Check
                              size={15}
                              className="text-[#D0A765]"
                            />
                          )}

                        </button>
                      )
                    }
                  )}

                </div>
              </Field>

            </div>
          </div>
        </FormSection>

        {/* ====================================================
            02 CONTENT
        ==================================================== */}

        <FormSection
          number="02"
          eyebrow="Editorial"
          title="Article content"
          description="Update the article body and summary displayed across the public website."
        >

          <div className="space-y-6">

            <Field
              label="Content"
              required
              hint={`${content.length} characters`}
            >

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value
                  )
                }
                rows={14}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                required
              />

            </Field>

            <Field
              label="Excerpt"
              hint={`${excerpt.length}/5000`}
            >

              <textarea
                value={excerpt}
                onChange={(event) =>
                  setExcerpt(
                    event.target.value
                  )
                }
                maxLength={5000}
                rows={4}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
              />

            </Field>

          </div>
        </FormSection>

        {/* ====================================================
            03 MEDIA
        ==================================================== */}

        <FormSection
          number="03"
          eyebrow="Media"
          title="Cover image"
          description="Update the image reference associated with the article."
        >

          <Field
            label="Cover image URL"
            hint="Optional"
          >

            <div className="relative">

              <Globe2
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="url"
                value={coverImage}
                onChange={(event) =>
                  setCoverImage(
                    event.target.value
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
              />

            </div>

            <p className="mt-2 text-[10px] leading-5 text-slate-400">
              Media assets remain managed by the dedicated Media module.
            </p>

          </Field>
        </FormSection>

        {/* ====================================================
            RECORD INFORMATION
        ==================================================== */}

        <FormSection
          number="04"
          eyebrow="Record"
          title="Article metadata"
          description="System information currently associated with this content record."
        >

          <div className="grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Article ID
              </p>

              <p className="mt-2 break-all font-mono text-[11px] text-slate-600">
                {article.id}
              </p>

            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Created
              </p>

              <p className="mt-2 text-sm font-medium text-slate-700">
                {formatDateTime(
                  article.created_at
                )}
              </p>

            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Published
              </p>

              <p className="mt-2 text-sm font-medium text-slate-700">
                {formatDateTime(
                  article.published_at
                )}
              </p>

            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Last updated
              </p>

              <p className="mt-2 text-sm font-medium text-slate-700">
                {formatDateTime(
                  article.updated_at
                )}
              </p>

            </div>

          </div>
        </FormSection>

        {/* ====================================================
            SECURITY SUMMARY
        ==================================================== */}

        <section className="rounded-[26px] border border-slate-200/80 bg-[#0A0C0B] p-5 text-white shadow-[0_15px_45px_rgba(10,12,11,0.12)] sm:p-7">

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D0A765]">
                <ShieldCheck size={20} />
              </div>

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D0A765]">
                  Secure content management
                </p>

                <h3 className="mt-1 text-sm font-semibold">
                  Ready to save your changes
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
                  The authenticated session and current role are revalidated before content changes are written to Supabase.
                </p>

              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:min-w-[290px]">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                Current publication
              </p>

              <div className="mt-3 space-y-2">

                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span className="text-white/35">
                    Category
                  </span>

                  <span className="font-semibold text-white">
                    {
                      selectedCategory?.label
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span className="text-white/35">
                    Status
                  </span>

                  <span className="font-semibold text-white">
                    {
                      selectedStatus?.label
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span className="text-white/35">
                    URL
                  </span>

                  <span className="max-w-[170px] truncate font-semibold text-white">
                    /news/
                    {previewSlug}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ====================================================
            ACTION BAR
        ==================================================== */}

        <div className="sticky bottom-4 z-20">

          <div className="flex flex-col justify-between gap-3 rounded-[22px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.13)] backdrop-blur-xl sm:flex-row sm:items-center">

            <div className="flex items-center gap-3 px-2">

              <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex">
                <FileText size={15} />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-800">
                  {saving
                    ? 'Saving changes...'
                    : 'Article ready'}
                </p>

                <p className="text-[10px] text-slate-400">
                  Your changes will be validated before being saved.
                </p>

              </div>
            </div>

            <div className="flex gap-2">

              <button
                type="button"
                disabled={
                  saving ||
                  deleting
                }
                onClick={() =>
                  router.back()
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <ArrowLeft size={14} />
                Previous
              </button>

              <button
                type="submit"
                disabled={
                  saving ||
                  deleting
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>

            </div>
          </div>
        </div>

      </form>

    </div>
  )
}