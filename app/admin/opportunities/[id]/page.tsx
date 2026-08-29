'use client'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react'

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

type Contact = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  phone: string | null
  country: string | null
}

type Organization = {
  id: string
  name: string | null
  type: string | null
  country: string | null
}

type HistoryItem = {
  id: string
  opportunity_id: string
  status_from: string | null
  status_to: string
  changed_by: string | null
  comment: string | null
  created_at: string
}

type Note = {
  id: string
  opportunity_id: string
  author_id: string | null
  content: string
  created_at: string
  updated_at: string
}

/* ============================================================
   CONSTANTS
============================================================ */

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  {
    value: 'awaiting_information',
    label: 'Awaiting Information',
  },
  { value: 'qualified', label: 'Qualified' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_discussion', label: 'In Discussion' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
] as const

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

const PRIORITY_LABELS: Record<
  Opportunity['priority'],
  string
> = {
  high: 'High',
  medium: 'Medium',
  standard: 'Standard',
}

const ROLE_ALLOWED = [
  'super_admin',
  'admin',
  'opportunity_manager',
] as const

/* ============================================================
   HELPERS
============================================================ */

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

    default:
      return 'bg-slate-50 text-slate-600 ring-slate-500/10'
  }
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(new Date(value))
}

function formatShortDate(
  value: string | null | undefined
) {
  if (!value) return '—'

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(new Date(value))
}

function statusLabel(
  status: string | null | undefined
) {
  if (!status) return '—'

  return (
    STATUS_OPTIONS.find(
      (item) => item.value === status
    )?.label ?? status
  )
}

/* ============================================================
   UI COMPONENTS
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
    <section className="rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        {eyebrow && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-slate-950">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
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

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl py-2">
      {icon && (
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>

        <div className="mt-1 break-words text-sm text-slate-800">
          {value || '—'}
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#0A0C0B] shadow-[0_12px_35px_rgba(10,12,11,0.16)]">
          <img
            src="/images/logo-bmi.png"
            alt="Barack Mining Investment"
            className="max-h-9 max-w-[44px] object-contain brightness-0 invert"
          />
        </div>

        <div className="mx-auto mt-5 h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

        <p className="mt-4 text-sm font-semibold text-slate-900">
          Loading opportunity
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Preparing the secure workspace...
        </p>

      </div>
    </div>
  )
}

/* ============================================================
   PAGE
============================================================ */

export default function OpportunityDetailPage() {
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

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [opportunity, setOpportunity] =
    useState<Opportunity | null>(null)

  const [contact, setContact] =
    useState<Contact | null>(null)

  const [organization, setOrganization] =
    useState<Organization | null>(null)

  const [history, setHistory] =
    useState<HistoryItem[]>([])

  const [notes, setNotes] =
    useState<Note[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  /* ----------------------------------------------------------
     FORM STATE
  ---------------------------------------------------------- */

  const [status, setStatus] =
    useState<Opportunity['status']>('new')

  const [priority, setPriority] =
    useState<Opportunity['priority']>(
      'standard'
    )

  const [assignedTo, setAssignedTo] =
    useState<string>('')

  const [isUpdating, setIsUpdating] =
    useState(false)

  /* ----------------------------------------------------------
     NOTES
  ---------------------------------------------------------- */

  const [newNote, setNewNote] =
    useState('')

  const [isAddingNote, setIsAddingNote] =
    useState(false)

  /* ==========================================================
     VERIFY ACCESS
  ========================================================== */

  const verifyAccess = useCallback(
    async () => {
      setCheckingAccess(true)

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
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('id', user.id)
          .maybeSingle()

        if (profileError || !profile) {
          router.replace('/login')
          return
        }

        const canAccess =
          ROLE_ALLOWED.includes(
            profile.role as (typeof ROLE_ALLOWED)[number]
          )

        if (!canAccess) {
          setAuthorized(false)
          return
        }

        setAuthorized(true)
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
     LOAD DATA
  ========================================================== */

  const loadData = useCallback(
    async () => {
      if (!authorized) return

      setLoading(true)
      setError(null)

      try {
        const {
          data: oppData,
          error: oppError,
        } = await supabase
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
          .eq('id', id)
          .maybeSingle()

        if (oppError) {
          console.error(
            'Opportunity error:',
            oppError
          )

          setError(
            'Unable to load this opportunity.'
          )

          return
        }

        if (!oppData) {
          setError(
            'This opportunity could not be found.'
          )

          return
        }

        const typedOpportunity =
          oppData as Opportunity

        setOpportunity(
          typedOpportunity
        )

        setStatus(
          typedOpportunity.status
        )

        setPriority(
          typedOpportunity.priority
        )

        setAssignedTo(
          typedOpportunity.assigned_to ??
            ''
        )

        /* ------------------------------------------------------
           Related contact
        ------------------------------------------------------ */

        if (typedOpportunity.contact_id) {
          const {
            data: contactData,
          } = await supabase
            .from('contacts')
            .select(
              `
                id,
                first_name,
                last_name,
                email,
                phone,
                country
              `
            )
            .eq(
              'id',
              typedOpportunity.contact_id
            )
            .maybeSingle()

          setContact(
            (contactData as Contact) ??
              null
          )
        } else {
          setContact(null)
        }

        /* ------------------------------------------------------
           Related organization
        ------------------------------------------------------ */

        if (
          typedOpportunity.organization_id
        ) {
          const {
            data: organizationData,
          } = await supabase
            .from('organizations')
            .select(
              `
                id,
                name,
                type,
                country
              `
            )
            .eq(
              'id',
              typedOpportunity.organization_id
            )
            .maybeSingle()

          setOrganization(
            (organizationData as Organization) ??
              null
          )
        } else {
          setOrganization(null)
        }

        /* ------------------------------------------------------
           History
        ------------------------------------------------------ */

        const {
          data: historyData,
          error: historyError,
        } = await supabase
          .from('opportunity_history')
          .select(
            `
              id,
              opportunity_id,
              status_from,
              status_to,
              changed_by,
              comment,
              created_at
            `
          )
          .eq(
            'opportunity_id',
            id
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          )

        if (historyError) {
          console.error(
            'History error:',
            historyError
          )
        }

        setHistory(
          (historyData as HistoryItem[]) ??
            []
        )

        /* ------------------------------------------------------
           Notes
        ------------------------------------------------------ */

        const {
          data: notesData,
          error: notesError,
        } = await supabase
          .from('opportunity_notes')
          .select(
            `
              id,
              opportunity_id,
              author_id,
              content,
              created_at,
              updated_at
            `
          )
          .eq(
            'opportunity_id',
            id
          )
          .order(
            'created_at',
            {
              ascending: false,
            }
          )

        if (notesError) {
          console.error(
            'Notes error:',
            notesError
          )
        }

        setNotes(
          (notesData as Note[]) ?? []
        )
      } catch (loadError) {
        console.error(
          'Unexpected error:',
          loadError
        )

        setError(
          'An unexpected error occurred while loading this opportunity.'
        )
      } finally {
        setLoading(false)
      }
    },
    [authorized, id, supabase]
  )

  useEffect(() => {
    if (authorized) {
      loadData()
    }
  }, [authorized, loadData])

  /* ==========================================================
     UPDATE
  ========================================================== */

  const handleUpdateOpportunity =
    async () => {
      if (!opportunity) return

      /* Important: no-op */
      const statusChanged =
        status !== opportunity.status

      const priorityChanged =
        priority !== opportunity.priority

      const assignmentChanged =
        (assignedTo || null) !==
        opportunity.assigned_to

      if (
        !statusChanged &&
        !priorityChanged &&
        !assignmentChanged
      ) {
        return
      }

      setIsUpdating(true)

      try {
        const updates: Partial<Opportunity> &
          Record<string, unknown> = {
          status,
          priority,
          assigned_to:
            assignedTo.trim() || null,
          updated_at:
            new Date().toISOString(),
        }

        if (
          status === 'closed' &&
          opportunity.status !==
            'closed'
        ) {
          updates.closed_at =
            new Date().toISOString()
        }

        if (
          status !== 'closed' &&
          opportunity.status ===
            'closed'
        ) {
          updates.closed_at = null
        }

        const {
          error: updateError,
        } = await supabase
          .from('opportunities')
          .update(updates)
          .eq('id', id)

        if (updateError) {
          console.error(
            'Update opportunity error:',
            updateError
          )

          window.alert(
            'Unable to update this opportunity.'
          )

          return
        }

        /* ------------------------------------------------------
           History only when status changed
        ------------------------------------------------------ */

        if (statusChanged) {
          const {
            data: {
              user,
            },
          } =
            await supabase.auth.getUser()

          if (user) {
            const {
              error: historyError,
            } = await supabase
              .from(
                'opportunity_history'
              )
              .insert({
                opportunity_id: id,
                status_from:
                  opportunity.status,
                status_to: status,
                changed_by: user.id,
                comment:
                  'Opportunity status updated from the Intelligence Hub.',
              })

            if (historyError) {
              console.error(
                'History insert error:',
                historyError
              )
            }
          }
        }

        await loadData()

        window.alert(
          'Opportunity updated successfully.'
        )
      } catch (updateError) {
        console.error(
          'Unexpected update error:',
          updateError
        )

        window.alert(
          'Unable to update this opportunity.'
        )
      } finally {
        setIsUpdating(false)
      }
    }

  /* ==========================================================
     ADD NOTE
  ========================================================== */

  const handleAddNote =
    async () => {
      const content =
        newNote.trim()

      if (!content) return

      setIsAddingNote(true)

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
          error: noteError,
        } = await supabase
          .from(
            'opportunity_notes'
          )
          .insert({
            opportunity_id: id,
            author_id: user.id,
            content,
          })

        if (noteError) {
          console.error(
            'Add note error:',
            noteError
          )

          window.alert(
            'Unable to add this note.'
          )

          return
        }

        setNewNote('')
        await loadData()
      } catch (noteError) {
        console.error(
          'Unexpected note error:',
          noteError
        )

        window.alert(
          'Unable to add this note.'
        )
      } finally {
        setIsAddingNote(false)
      }
    }

  /* ==========================================================
     RENDER STATES
  ========================================================== */

  if (checkingAccess) {
    return <LoadingScreen />
  }

  if (!authorized) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[26px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_65px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldCheck size={23} />
          </div>

          <h2 className="mt-5 text-lg font-semibold">
            Access restricted
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your current role does not allow access to
            opportunity management.
          </p>

          <button
            type="button"
            onClick={() =>
              router.replace('/admin')
            }
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </button>

        </div>
      </div>
    )
  }

  if (loading) {
    return <LoadingScreen />
  }

  if (error || !opportunity) {
    return (
      <div className="space-y-5">

        {/* Back */}
        <button
          type="button"
          onClick={() =>
            router.push(
              '/admin/opportunities'
            )
          }
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft size={15} />
          Back to Opportunities
        </button>

        <div className="rounded-[24px] border border-red-200 bg-white p-10 text-center shadow-[0_15px_45px_rgba(15,23,42,0.05)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <BriefcaseBusiness
              size={22}
            />
          </div>

          <h2 className="mt-5 text-base font-semibold text-slate-950">
            Opportunity unavailable
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error ??
              'This opportunity could not be found.'}
          </p>

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
          BREADCRUMB / HEADER
      ======================================================== */}

      <section>
        <div className="flex flex-col gap-5">

          {/* Back / breadcrumb */}
          <div className="flex flex-wrap items-center gap-2">

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/opportunities'
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

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/opportunities'
                )
              }
              className="text-xs font-medium text-slate-400 transition hover:text-slate-700"
            >
              Opportunities
            </button>

            <span className="text-slate-300">
              /
            </span>

            <span className="max-w-[220px] truncate text-xs font-semibold text-slate-700">
              {opportunity.reference}
            </span>

          </div>

          {/* Main heading */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ring-1 ring-inset ${getStatusClass(
                    opportunity.status
                  )}`}
                >
                  {statusLabel(
                    opportunity.status
                  )}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ring-1 ring-inset ${getPriorityClass(
                    opportunity.priority
                  )}`}
                >
                  {PRIORITY_LABELS[
                    opportunity.priority
                  ]}
                </span>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
                  {CATEGORY_LABELS[
                    opportunity.category
                  ]}
                </span>

              </div>

              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                Opportunity
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
                {opportunity.reference}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Submitted on{' '}
                {formatShortDate(
                  opportunity.submitted_at
                )}
                {opportunity.source
                  ? ` · Source: ${opportunity.source}`
                  : ''}
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/opportunities'
                )
              }
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <BriefcaseBusiness
                size={15}
              />
              All Opportunities
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================
          TOP INFO STRIP
      ======================================================== */}

      <section className="grid gap-3 sm:grid-cols-3">

        <div className="rounded-[20px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center gap-2 text-slate-400">
            <Calendar size={15} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              Submitted
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(
              opportunity.submitted_at
            )}
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={15} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              Last updated
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(
              opportunity.updated_at
            )}
          </p>

        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)]">

          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2
              size={15}
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              Current state
            </span>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {statusLabel(
              opportunity.status
            )}
          </p>

        </div>

      </section>

      {/* ========================================================
          MAIN GRID
      ======================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">

        {/* ======================================================
            LEFT
        ====================================================== */}

        <div className="space-y-6">

          {/* Opportunity information */}
          <Section
            eyebrow="Overview"
            title="Opportunity information"
            description="Core information submitted through the opportunity workflow."
          >
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">

              <DetailRow
                label="Reference"
                value={
                  <span className="font-semibold">
                    {opportunity.reference}
                  </span>
                }
                icon={
                  <FileText
                    size={15}
                  />
                }
              />

              <DetailRow
                label="Category"
                value={
                  CATEGORY_LABELS[
                    opportunity.category
                  ]
                }
                icon={
                  <BriefcaseBusiness
                    size={15}
                  />
                }
              />

              <DetailRow
                label="Source"
                value={
                  opportunity.source ??
                  'Website'
                }
                icon={
                  <Globe2
                    size={15}
                  />
                }
              />

              <DetailRow
                label="Assigned to"
                value={
                  opportunity.assigned_to ??
                  'Not assigned'
                }
                icon={
                  <User size={15} />
                }
              />

              <DetailRow
                label="Submitted"
                value={formatDate(
                  opportunity.submitted_at
                )}
                icon={
                  <Calendar
                    size={15}
                  />
                }
              />

              <DetailRow
                label="Last updated"
                value={formatDate(
                  opportunity.updated_at
                )}
                icon={
                  <Clock size={15} />
                }
              />

              {opportunity.closed_at && (
                <DetailRow
                  label="Closed"
                  value={formatDate(
                    opportunity.closed_at
                  )}
                  icon={
                    <CheckCircle2
                      size={15}
                    />
                  }
                />
              )}

            </div>

            {opportunity.description && (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Description
                </p>

                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {opportunity.description}
                </p>
              </div>
            )}
          </Section>

          {/* Metadata */}
          {opportunity.metadata &&
            Object.keys(
              opportunity.metadata
            ).length > 0 && (
              <Section
                eyebrow="Submission"
                title="Additional information"
                description="Additional fields received through the adaptive opportunity form."
              >
                <div className="divide-y divide-slate-100">

                  {Object.entries(
                    opportunity.metadata
                  ).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"
                      >

                        <p className="text-xs font-semibold capitalize text-slate-400">
                          {key.replace(
                            /_/g,
                            ' '
                          )}
                        </p>

                        <p className="break-words text-sm leading-6 text-slate-700">
                          {typeof value ===
                          'string'
                            ? value
                            : JSON.stringify(
                                value
                              )}
                        </p>

                      </div>
                    )
                  )}

                </div>
              </Section>
            )}

          {/* Notes */}
          <Section
            eyebrow="Internal"
            title="Internal notes"
            description="Private operational notes. These are not public."
          >
            <div className="space-y-4">

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">

                <textarea
                  value={newNote}
                  onChange={(event) =>
                    setNewNote(
                      event.target.value
                    )
                  }
                  placeholder="Write an internal note..."
                  rows={4}
                  maxLength={5000}
                  className="w-full resize-none bg-transparent text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
                />

                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">

                  <span className="text-[10px] text-slate-400">
                    {newNote.length}/5000
                  </span>

                  <button
                    type="button"
                    onClick={handleAddNote}
                    disabled={
                      isAddingNote ||
                      !newNote.trim()
                    }
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isAddingNote ? (
                      <>
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        Add note
                      </>
                    )}
                  </button>

                </div>

              </div>

              {notes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-9 text-center">

                  <FileText
                    size={20}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    No internal notes
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Add the first internal note to this opportunity.
                  </p>

                </div>
              ) : (
                <div className="space-y-3">

                  {notes.map(
                    (note) => (
                      <article
                        key={note.id}
                        className="rounded-2xl border border-slate-100 bg-white p-4"
                      >

                        <div className="flex items-start justify-between gap-4">

                          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {note.content}
                          </p>

                          <span className="shrink-0 text-[10px] font-medium text-slate-400">
                            {formatShortDate(
                              note.created_at
                            )}
                          </span>

                        </div>

                      </article>
                    )
                  )}

                </div>
              )}

            </div>
          </Section>

        </div>

        {/* ======================================================
            RIGHT
        ====================================================== */}

        <aside className="space-y-6">

          {/* Contact */}
          <Section
            eyebrow="Relationship"
            title="Contact"
          >
            {contact ? (
              <div className="space-y-1">

                <DetailRow
                  label="Name"
                  value={
                    `${contact.first_name ?? ''} ${
                      contact.last_name ?? ''
                    }`.trim() ||
                    '—'
                  }
                  icon={
                    <User size={15} />
                  }
                />

                {contact.email && (
                  <DetailRow
                    label="Email"
                    value={
                      <a
                        href={`mailto:${contact.email}`}
                        className="font-medium text-[#A96F35] transition hover:text-[#855526] hover:underline"
                      >
                        {contact.email}
                      </a>
                    }
                    icon={
                      <Mail size={15} />
                    }
                  />
                )}

                {contact.phone && (
                  <DetailRow
                    label="Phone"
                    value={
                      <a
                        href={`tel:${contact.phone}`}
                        className="font-medium text-slate-700 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    }
                    icon={
                      <Phone size={15} />
                    }
                  />
                )}

                {contact.country && (
                  <DetailRow
                    label="Country"
                    value={contact.country}
                    icon={
                      <MapPin size={15} />
                    }
                  />
                )}

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-7 text-center">

                <User
                  size={20}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No contact linked
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  This opportunity has no linked contact.
                </p>

              </div>
            )}
          </Section>

          {/* Organization */}
          <Section
            eyebrow="Organization"
            title="Organization"
          >
            {organization ? (
              <div className="space-y-1">

                <DetailRow
                  label="Name"
                  value={
                    organization.name ??
                    '—'
                  }
                  icon={
                    <Users size={15} />
                  }
                />

                <DetailRow
                  label="Type"
                  value={
                    organization.type ??
                    '—'
                  }
                />

                <DetailRow
                  label="Country"
                  value={
                    organization.country ??
                    '—'
                  }
                  icon={
                    <MapPin size={15} />
                  }
                />

              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-7 text-center">

                <Users
                  size={20}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No organization linked
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  No organization is associated with this opportunity.
                </p>

              </div>
            )}
          </Section>

          {/* Update */}
          <Section
            eyebrow="Workflow"
            title="Manage opportunity"
            description="Update the current status, priority and responsible person."
          >
            <div className="space-y-4">

              <div>
                <label
                  htmlFor="opportunity-status"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Status
                </label>

                <select
                  id="opportunity-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as Opportunity['status']
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
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
                  htmlFor="opportunity-priority"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Priority
                </label>

                <select
                  id="opportunity-priority"
                  value={priority}
                  onChange={(event) =>
                    setPriority(
                      event.target.value as Opportunity['priority']
                    )
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                >
                  <option value="high">
                    High
                  </option>
                  <option value="medium">
                    Medium
                  </option>
                  <option value="standard">
                    Standard
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="opportunity-assignee"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400"
                >
                  Assigned to
                </label>

                <input
                  id="opportunity-assignee"
                  type="text"
                  value={assignedTo}
                  onChange={(event) =>
                    setAssignedTo(
                      event.target.value
                    )
                  }
                  maxLength={120}
                  placeholder="Profile ID / responsible user"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />

                <p className="mt-2 text-[10px] leading-4 text-slate-400">
                  This field currently maps directly to the
                  `assigned_to` profile reference defined in
                  the database.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">

                <button
                  type="button"
                  onClick={
                    handleUpdateOpportunity
                  }
                  disabled={isUpdating}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(10,12,11,0.14)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {isUpdating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </div>
          </Section>

          {/* History */}
          <Section
            eyebrow="Audit trail"
            title="Activity history"
          >
            {history.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-7 text-center">

                <Clock
                  size={20}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-semibold text-slate-700">
                  No history yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Status changes will appear here.
                </p>

              </div>
            ) : (
              <div className="relative space-y-5">

                <div className="absolute bottom-3 left-[7px] top-3 w-px bg-slate-200" />

                {history.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="relative flex gap-3"
                    >

                      <div className="relative z-10 mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white bg-slate-400 shadow-sm" />

                      <div className="min-w-0">

                        <p className="text-xs font-semibold leading-5 text-slate-800">
                          {item.status_from
                            ? `Status changed from ${statusLabel(
                                item.status_from
                              )} to ${statusLabel(
                                item.status_to
                              )}`
                            : `Status set to ${statusLabel(
                                item.status_to
                              )}`}
                        </p>

                        {item.comment && (
                          <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            {item.comment}
                          </p>
                        )}

                        <p className="mt-1 text-[10px] text-slate-400">
                          {formatDate(
                            item.created_at
                          )}
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}
          </Section>

        </aside>
      </div>

      {/* ========================================================
          BOTTOM BACK ACTION
      ======================================================== */}

      <div className="flex justify-start border-t border-slate-200 pt-5">

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

      </div>

    </div>
  )
}