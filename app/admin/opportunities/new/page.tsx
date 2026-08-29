'use client'

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileJson,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/* ============================================================
   TYPES
============================================================ */

type Category =
  | 'investor'
  | 'concession'
  | 'mineral_supply'
  | 'mining_company'
  | 'strategic_partner'
  | 'other'

type Status =
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

type Priority =
  | 'high'
  | 'medium'
  | 'standard'

type OrganizationType =
  | 'investor'
  | 'mining_company'
  | 'supplier'
  | 'partner'
  | 'other'

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: string
}

type OpportunityRecord = {
  id: string
  reference: string
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
    value: 'investor',
    label: 'Investor',
    description:
      'Investment interest or investment opportunity.',
  },
  {
    value: 'concession',
    label: 'Asset / Concession',
    description:
      'Mining asset, concession or related opportunity.',
  },
  {
    value: 'mineral_supply',
    label: 'Mineral Supply',
    description:
      'Mineral supply or commercial opportunity.',
  },
  {
    value: 'mining_company',
    label: 'Mining Company',
    description:
      'Mining company seeking discussion or support.',
  },
  {
    value: 'strategic_partner',
    label: 'Strategic Partner',
    description:
      'Strategic collaboration or partnership.',
  },
  {
    value: 'other',
    label: 'Other',
    description:
      'Opportunity outside the main categories.',
  },
]

const STATUS_OPTIONS: {
  value: Status
  label: string
}[] = [
  { value: 'new', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  {
    value: 'awaiting_information',
    label: 'Awaiting Information',
  },
  { value: 'qualified', label: 'Qualified' },
  { value: 'assigned', label: 'Assigned' },
  {
    value: 'in_discussion',
    label: 'In Discussion',
  },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
]

const PRIORITY_OPTIONS: {
  value: Priority
  label: string
  description: string
}[] = [
  {
    value: 'high',
    label: 'High',
    description:
      'Requires prompt attention.',
  },
  {
    value: 'medium',
    label: 'Medium',
    description:
      'Requires normal follow-up.',
  },
  {
    value: 'standard',
    label: 'Standard',
    description:
      'No immediate priority.',
  },
]

const ORGANIZATION_TYPE_OPTIONS: {
  value: OrganizationType
  label: string
}[] = [
  {
    value: 'investor',
    label: 'Investor',
  },
  {
    value: 'mining_company',
    label: 'Mining Company',
  },
  {
    value: 'supplier',
    label: 'Supplier',
  },
  {
    value: 'partner',
    label: 'Partner',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

const AUTHORIZED_ROLES = [
  'super_admin',
  'admin',
  'opportunity_manager',
] as const

/* ============================================================
   HELPERS
============================================================ */

function getInitials(
  name: string | null,
  email: string | null
) {
  const value =
    name?.trim() ||
    email?.trim() ||
    'BMI'

  const parts = value
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  )
}

function getTodayUtcBounds() {
  const now = new Date()

  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0
    )
  )

  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
      0
    )
  )

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    year: now.getUTCFullYear(),
  }
}

function getStatusClass(status: Status) {
  switch (status) {
    case 'new':
      return 'bg-blue-50 text-blue-700'

    case 'under_review':
      return 'bg-amber-50 text-amber-700'

    case 'awaiting_information':
      return 'bg-orange-50 text-orange-700'

    case 'qualified':
      return 'bg-violet-50 text-violet-700'

    case 'assigned':
      return 'bg-indigo-50 text-indigo-700'

    case 'in_discussion':
      return 'bg-cyan-50 text-cyan-700'

    case 'active':
      return 'bg-emerald-50 text-emerald-700'

    case 'on_hold':
      return 'bg-slate-100 text-slate-600'

    case 'closed':
      return 'bg-slate-100 text-slate-700'

    case 'rejected':
      return 'bg-red-50 text-red-700'

    default:
      return 'bg-slate-50 text-slate-600'
  }
}

/* ============================================================
   INPUT
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
            <span className="ml-1 text-red-500">
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

const inputClass =
  'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

const selectClass =
  'h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

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
   PAGE
============================================================ */

export default function NewOpportunityPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     AUTH
  ---------------------------------------------------------- */

  const [authorized, setAuthorized] =
    useState(false)

  const [checkingAccess, setCheckingAccess] =
    useState(true)

  const [currentProfile, setCurrentProfile] =
    useState<Profile | null>(null)

  /* ----------------------------------------------------------
     DATA
  ---------------------------------------------------------- */

  const [profiles, setProfiles] =
    useState<Profile[]>([])

  /* ----------------------------------------------------------
     FORM
  ---------------------------------------------------------- */

  const [category, setCategory] =
    useState<Category>('investor')

  const [status, setStatus] =
    useState<Status>('new')

  const [priority, setPriority] =
    useState<Priority>('standard')

  const [description, setDescription] =
    useState('')

  const [assignedTo, setAssignedTo] =
    useState('')

  const [metadata, setMetadata] =
    useState('')

  /* ----------------------------------------------------------
     CONTACT
  ---------------------------------------------------------- */

  const [hasContact, setHasContact] =
    useState(true)

  const [contactFirstName, setContactFirstName] =
    useState('')

  const [contactLastName, setContactLastName] =
    useState('')

  const [contactEmail, setContactEmail] =
    useState('')

  const [contactPhone, setContactPhone] =
    useState('')

  const [contactCountry, setContactCountry] =
    useState('')

  /* ----------------------------------------------------------
     ORGANIZATION
  ---------------------------------------------------------- */

  const [hasOrganization, setHasOrganization] =
    useState(false)

  const [orgName, setOrgName] =
    useState('')

  const [orgType, setOrgType] =
    useState<OrganizationType>('other')

  const [orgCountry, setOrgCountry] =
    useState('')

  /* ----------------------------------------------------------
     UI STATE
  ---------------------------------------------------------- */

  const [loading, setLoading] =
    useState(false)

  const [pageLoading, setPageLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState(false)

  const [createdReference, setCreatedReference] =
    useState<string | null>(null)

  const [createdOpportunityId, setCreatedOpportunityId] =
    useState<string | null>(null)

  /* ==========================================================
     AUTHORIZATION
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
          .select(
            'id, email, full_name, role'
          )
          .eq('id', user.id)
          .maybeSingle()

        if (profileError || !profile) {
          router.replace('/login')
          return
        }

        const allowed =
          AUTHORIZED_ROLES.includes(
            profile.role as (typeof AUTHORIZED_ROLES)[number]
          )

        setCurrentProfile(
          profile as Profile
        )

        if (!allowed) {
          setAuthorized(false)
          return
        }

        setAuthorized(true)

        /* ------------------------------------------------------
           Profiles disponibles pour l'assignation.
           Les RLS restent la barrière réelle.
        ------------------------------------------------------ */

        const {
          data: availableProfiles,
          error: profilesError,
        } = await supabase
          .from('profiles')
          .select(
            'id, email, full_name, role'
          )
          .in('role', [
            'super_admin',
            'admin',
            'opportunity_manager',
          ])
          .order('full_name', {
            ascending: true,
          })

        if (profilesError) {
          console.error(
            'Profiles loading error:',
            profilesError
          )
        }

        setProfiles(
          (availableProfiles as Profile[]) ??
            []
        )
      } catch (accessError) {
        console.error(
          'Access verification error:',
          accessError
        )

        router.replace('/login')
      } finally {
        setCheckingAccess(false)
        setPageLoading(false)
      }
    },
    [router, supabase]
  )

  useEffect(() => {
    verifyAccess()
  }, [verifyAccess])

  /* ==========================================================
     SESSION LISTENER
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
     DERIVED DATA
  ========================================================== */

  const selectedCategory =
    useMemo(
      () =>
        CATEGORY_OPTIONS.find(
          (item) =>
            item.value === category
        ),
      [category]
    )

  const selectedAssignee =
    useMemo(
      () =>
        profiles.find(
          (profile) =>
            profile.id === assignedTo
        ),
      [assignedTo, profiles]
    )

  const canAssignUsers =
    profiles.length > 0

  /* ==========================================================
     VALIDATION
  ========================================================== */

  const validateForm = () => {
    const cleanDescription =
      description.trim()

    if (!category) {
      return 'Please select an opportunity category.'
    }

    if (
      hasContact &&
      contactEmail.trim() &&
      !isValidEmail(
        contactEmail.trim()
      )
    ) {
      return 'Please enter a valid contact email address.'
    }

    if (
      hasContact &&
      !contactFirstName.trim() &&
      !contactLastName.trim() &&
      !contactEmail.trim() &&
      !contactPhone.trim()
    ) {
      return 'Please provide at least one contact detail or disable the contact section.'
    }

    if (
      hasOrganization &&
      !orgName.trim()
    ) {
      return 'Please enter the organization name.'
    }

    if (cleanDescription.length > 10000) {
      return 'The description is too long.'
    }

    if (metadata.trim()) {
      try {
        const parsed =
          JSON.parse(metadata)

        if (
          parsed === null ||
          Array.isArray(parsed) ||
          typeof parsed !== 'object'
        ) {
          return 'Additional data must be a JSON object.'
        }
      } catch {
        return 'Additional data must contain valid JSON.'
      }
    }

    if (
      assignedTo &&
      !profiles.some(
        (profile) =>
          profile.id === assignedTo
      )
    ) {
      return 'The selected assignee is not available.'
    }

    return null
  }

  /* ==========================================================
     REFERENCE
  ========================================================== */

  const generateReference =
    async () => {
      const {
        start,
        end,
        year,
      } =
        getTodayUtcBounds()

      const {
        count,
        error: countError,
      } = await supabase
        .from('opportunities')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .gte(
          'submitted_at',
          start
        )
        .lt(
          'submitted_at',
          end
        )

      if (countError) {
        throw new Error(
          'Unable to prepare the opportunity reference.'
        )
      }

      const sequence =
        (count ?? 0) + 1

      return `BMI-${year}-${String(
        sequence
      ).padStart(4, '0')}`
    }

  /* ==========================================================
     CREATE CONTACT
  ========================================================== */

  const createContact =
    async () => {
      if (!hasContact) {
        return null
      }

      const firstName =
        contactFirstName.trim()

      const lastName =
        contactLastName.trim()

      const email =
        contactEmail.trim()

      const phone =
        contactPhone.trim()

      const country =
        contactCountry.trim()

      if (
        !firstName &&
        !lastName &&
        !email &&
        !phone &&
        !country
      ) {
        return null
      }

      const {
        data,
        error: contactError,
      } = await supabase
        .from('contacts')
        .insert({
          first_name:
            firstName || null,
          last_name:
            lastName || null,
          email:
            email || null,
          phone:
            phone || null,
          country:
            country || null,
        })
        .select('id')
        .single()

      if (contactError) {
        console.error(
          'Contact creation error:',
          contactError
        )

        throw new Error(
          'Unable to create the contact.'
        )
      }

      return data.id as string
    }

  /* ==========================================================
     CREATE ORGANIZATION
  ========================================================== */

  const createOrganization =
    async () => {
      if (
        !hasOrganization ||
        !orgName.trim()
      ) {
        return null
      }

      const {
        data,
        error: organizationError,
      } = await supabase
        .from('organizations')
        .insert({
          name:
            orgName.trim(),
          type: orgType,
          country:
            orgCountry.trim() ||
            null,
        })
        .select('id')
        .single()

      if (organizationError) {
        console.error(
          'Organization creation error:',
          organizationError
        )

        throw new Error(
          'Unable to create the organization.'
        )
      }

      return data.id as string
    }

  /* ==========================================================
     CREATE OPPORTUNITY
  ========================================================== */

  const handleSubmit =
    async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault()

      if (loading || success) {
        return
      }

      setError(null)

      const validationError =
        validateForm()

      if (validationError) {
        setError(
          validationError
        )
        return
      }

      setLoading(true)

      let contactId:
        | string
        | null = null

      let organizationId:
        | string
        | null = null

      try {
        /* ------------------------------------------------------
           Re-check session immediately before mutation
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
           Re-check current profile / role
        ------------------------------------------------------ */

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select(
            'id, email, full_name, role'
          )
          .eq('id', user.id)
          .maybeSingle()

        if (
          profileError ||
          !profile ||
          !AUTHORIZED_ROLES.includes(
            profile.role as (typeof AUTHORIZED_ROLES)[number]
          )
        ) {
          throw new Error(
            'Your current account is not authorized to create opportunities.'
          )
        }

        /* ------------------------------------------------------
           Contact
        ------------------------------------------------------ */

        contactId =
          await createContact()

        /* ------------------------------------------------------
           Organization
        ------------------------------------------------------ */

        organizationId =
          await createOrganization()

        /* ------------------------------------------------------
           Metadata
        ------------------------------------------------------ */

        let parsedMetadata:
          | Record<string, unknown>
          | null = null

        if (metadata.trim()) {
          parsedMetadata =
            JSON.parse(metadata)
        }

        /* ------------------------------------------------------
           Reference
        ------------------------------------------------------ */

        const reference =
          await generateReference()

        /* ------------------------------------------------------
           Opportunity
           submitted_at is intentionally omitted because
           Supabase defines DEFAULT now().
        ------------------------------------------------------ */

        const {
          data: opportunity,
          error:
            opportunityError,
        } = await supabase
          .from('opportunities')
          .insert({
            reference,
            category,
            status,
            priority,
            contact_id:
              contactId,
            organization_id:
              organizationId,
            description:
              description.trim() ||
              null,
            assigned_to:
              assignedTo || null,
            source: 'manual',
            metadata:
              parsedMetadata,
          })
          .select(
            'id, reference'
          )
          .single()

        if (opportunityError) {
          console.error(
            'Opportunity creation error:',
            opportunityError
          )

          /*
            A duplicate reference can theoretically happen
            when multiple administrators create opportunities
            at exactly the same time. The DB UNIQUE constraint
            will reject the second write instead of silently
            creating duplicate references.
          */
          if (
            opportunityError.code ===
            '23505'
          ) {
            throw new Error(
              'The generated reference already exists. Please try again.'
            )
          }

          throw new Error(
            'Unable to create the opportunity.'
          )
        }

        const created =
          opportunity as OpportunityRecord

        /* ------------------------------------------------------
           History
           IMPORTANT: now using the real opportunity ID.
        ------------------------------------------------------ */

        const {
          error: historyError,
        } = await supabase
          .from(
            'opportunity_history'
          )
          .insert({
            opportunity_id:
              created.id,
            status_from:
              null,
            status_to:
              status,
            changed_by:
              user.id,
            comment:
              'Opportunity created from the Intelligence Hub.',
          })

        if (historyError) {
          /*
             The opportunity already exists.
             We report the history problem but do not claim the
             whole creation failed.
          */
          console.error(
            'History creation error:',
            historyError
          )
        }

        /* ------------------------------------------------------
           Success
        ------------------------------------------------------ */

        setCreatedOpportunityId(
          created.id
        )

        setCreatedReference(
          created.reference
        )

        setSuccess(true)
      } catch (submissionError) {
        console.error(
          'Opportunity creation failed:',
          submissionError
        )

        setError(
          submissionError instanceof Error
            ? submissionError.message
            : 'Unable to create the opportunity.'
        )
      } finally {
        setLoading(false)
      }
    }

  /* ==========================================================
     RESET
  ========================================================== */

  const resetForm = () => {
    setCategory('investor')
    setStatus('new')
    setPriority('standard')
    setDescription('')
    setAssignedTo('')
    setMetadata('')

    setHasContact(true)
    setContactFirstName('')
    setContactLastName('')
    setContactEmail('')
    setContactPhone('')
    setContactCountry('')

    setHasOrganization(false)
    setOrgName('')
    setOrgType('other')
    setOrgCountry('')

    setError(null)
    setSuccess(false)
    setCreatedReference(null)
    setCreatedOpportunityId(null)
  }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (pageLoading || checkingAccess) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
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
            Preparing secure workspace
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Verifying your access...
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
            <ShieldCheck size={23} />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-950">
            Access restricted
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your account does not have permission to create
            or manage opportunities.
          </p>

          <p className="mt-3 text-xs text-slate-400">
            {currentProfile?.email ??
              'Authenticated user'}
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

  /* ==========================================================
     SUCCESS
  ========================================================== */

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center">

        <div className="w-full rounded-[30px] border border-emerald-200 bg-white p-8 text-center shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-10">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={29} />
          </div>

          <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Submission complete
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">
            Opportunity created
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            The opportunity has been successfully added to
            the Barack Mining Investment workspace.
          </p>

          <div className="mx-auto mt-7 max-w-sm rounded-2xl border border-slate-100 bg-slate-50 p-4">

            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Reference
            </p>

            <p className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              {createdReference}
            </p>

          </div>

          <div className="mt-7 grid gap-2 sm:grid-cols-2">

            {createdOpportunityId && (
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/admin/opportunities/${createdOpportunityId}`
                  )
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                Open opportunity
                <ArrowRight size={14} />
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                router.push(
                  '/admin/opportunities'
                )
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              All opportunities
            </button>

          </div>

          <button
            type="button"
            onClick={resetForm}
            className="mt-5 text-xs font-semibold text-slate-400 transition hover:text-slate-700"
          >
            Create another opportunity
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

          <span className="text-xs font-semibold text-slate-700">
            New
          </span>

        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>

            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 items-center rounded-full bg-[#F3EFE7] px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#94713F]">
                Opportunity Center
              </span>

              <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Secure workflow
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-slate-950">
              Create Opportunity
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Register a new business opportunity and connect
              it to the relevant contact or organization.
            </p>

          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
              <img
                src="/images/logo-bmi.png"
                alt="Barack Mining Investment"
                className="max-h-5 max-w-[27px] object-contain brightness-0 invert"
              />
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-900">
                {currentProfile?.full_name ??
                  'Administrator'}
              </p>

              <p className="text-[10px] text-slate-400">
                {currentProfile?.role
                  ?.replace(
                    /_/g,
                    ' '
                  )}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <CircleAlert size={17} />
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
            className="text-red-400 transition hover:text-red-700"
          >
            <X size={16} />
          </button>

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
            01 GENERAL
        ==================================================== */}

        <FormSection
          number="01"
          eyebrow="Opportunity"
          title="General information"
          description="Define the business category, current workflow state and operational priority."
        >

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Category */}
            <Field
              label="Category"
              required
              hint="Choose the closest match"
            >
              <div className="grid gap-2 sm:grid-cols-2">

                {CATEGORY_OPTIONS.map(
                  (option) => {
                    const selected =
                      category ===
                      option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setCategory(
                            option.value
                          )
                        }
                        className={`group rounded-2xl border p-4 text-left transition ${
                          selected
                            ? 'border-slate-950 bg-slate-950 text-white shadow-[0_10px_30px_rgba(10,12,11,0.12)]'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >

                        <div className="flex items-center justify-between gap-3">

                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                                selected
                                  ? 'bg-white/10'
                                  : 'bg-slate-100'
                              }`}
                            >
                              <BriefcaseBusiness
                                size={16}
                              />
                            </div>

                            <span className="text-xs font-semibold">
                              {
                                option.label
                              }
                            </span>

                          </div>

                          {selected && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D0A765] text-[#0A0C0B]">
                              <Check
                                size={12}
                                strokeWidth={
                                  3
                                }
                              />
                            </div>
                          )}

                        </div>

                        <p
                          className={`mt-3 text-[11px] leading-5 ${
                            selected
                              ? 'text-white/55'
                              : 'text-slate-500'
                          }`}
                        >
                          {
                            option.description
                          }
                        </p>

                      </button>
                    )
                  }
                )}

              </div>
            </Field>

            {/* Side values */}
            <div className="space-y-5">

              <Field
                label="Status"
                required
              >
                <div className="relative">

                  <select
                    value={status}
                    onChange={(
                      event
                    ) =>
                      setStatus(
                        event.target
                          .value as Status
                      )
                    }
                    className={`${selectClass} pr-10`}
                  >
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

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${getStatusClass(
                    status
                  )}`}
                >
                  {
                    STATUS_OPTIONS.find(
                      (item) =>
                        item.value ===
                        status
                    )?.label
                  }
                </span>
              </Field>

              <Field
                label="Priority"
                required
              >
                <div className="space-y-2">

                  {PRIORITY_OPTIONS.map(
                    (option) => {
                      const selected =
                        priority ===
                        option.value

                      return (
                        <button
                          type="button"
                          key={
                            option.value
                          }
                          onClick={() =>
                            setPriority(
                              option.value
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-left transition ${
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

          {/* Description */}
          <div className="mt-7">

            <Field
              label="Description"
              hint={`${description.length}/10000`}
            >
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                maxLength={10000}
                rows={6}
                placeholder={`Describe the opportunity, context, needs, proposed collaboration or other relevant information...`}
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </Field>

          </div>

          {/* Additional JSON */}
          <div className="mt-6">

            <Field
              label="Additional data"
              hint="Optional JSON object"
            >

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                    <FileJson
                      size={17}
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-semibold text-slate-700">
                      Structured information
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      Use this field for additional structured
                      information specific to the opportunity.
                    </p>

                  </div>

                </div>

                <textarea
                  value={metadata}
                  onChange={(event) =>
                    setMetadata(
                      event.target.value
                    )
                  }
                  rows={5}
                  spellCheck={false}
                  placeholder={`{
  "location": "DRC",
  "resource": "cobalt"
}`}
                  className="mt-4 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 font-mono text-xs leading-6 text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />

              </div>

            </Field>

          </div>

        </FormSection>

        {/* ====================================================
            02 CONTACT
        ==================================================== */}

        <FormSection
          number="02"
          eyebrow="Relationship"
          title="Contact information"
          description="Connect the opportunity to a person when contact information is available."
        >

          <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <User size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Link a contact
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Store the person associated with this opportunity.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setHasContact(
                  (value) => !value
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                hasContact
                  ? 'bg-slate-950'
                  : 'bg-slate-200'
              }`}
              aria-label="Toggle contact"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  hasContact
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

          {hasContact ? (
            <div className="grid gap-5 sm:grid-cols-2">

              <Field label="First name">
                <input
                  type="text"
                  value={
                    contactFirstName
                  }
                  onChange={(event) =>
                    setContactFirstName(
                      event.target.value
                    )
                  }
                  maxLength={120}
                  autoComplete="given-name"
                  placeholder="First name"
                  className={inputClass}
                />
              </Field>

              <Field label="Last name">
                <input
                  type="text"
                  value={
                    contactLastName
                  }
                  onChange={(event) =>
                    setContactLastName(
                      event.target.value
                    )
                  }
                  maxLength={120}
                  autoComplete="family-name"
                  placeholder="Last name"
                  className={inputClass}
                />
              </Field>

              <Field
                label="Email"
              >
                <div className="relative">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={
                      contactEmail
                    }
                    onChange={(event) =>
                      setContactEmail(
                        event.target
                          .value
                      )
                    }
                    maxLength={254}
                    autoComplete="email"
                    placeholder="contact@example.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              <Field label="Phone">
                <div className="relative">
                  <Phone
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="tel"
                    value={
                      contactPhone
                    }
                    onChange={(event) =>
                      setContactPhone(
                        event.target
                          .value
                      )
                    }
                    maxLength={40}
                    autoComplete="tel"
                    placeholder="+243 ..."
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

              <Field
                label="Country"
              >
                <div className="relative">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={
                      contactCountry
                    }
                    onChange={(event) =>
                      setContactCountry(
                        event.target
                          .value
                      )
                    }
                    maxLength={120}
                    autoComplete="country-name"
                    placeholder="Country"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-8 text-center">

              <User
                size={21}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No contact will be linked
              </p>

              <p className="mt-1 text-xs text-slate-400">
                You can add relationship information later.
              </p>

            </div>
          )}

        </FormSection>

        {/* ====================================================
            03 ORGANIZATION
        ==================================================== */}

        <FormSection
          number="03"
          eyebrow="Organization"
          title="Organization information"
          description="Associate the opportunity with an investor, company, supplier or strategic partner."
        >

          <div className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <Building2
                  size={17}
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Link an organization
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Create the organization record together with this opportunity.
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                setHasOrganization(
                  (value) => !value
                )
              }
              className={`relative h-6 w-11 rounded-full transition ${
                hasOrganization
                  ? 'bg-slate-950'
                  : 'bg-slate-200'
              }`}
              aria-label="Toggle organization"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                  hasOrganization
                    ? 'left-6'
                    : 'left-1'
                }`}
              />
            </button>

          </div>

          {hasOrganization ? (
            <div className="grid gap-5 sm:grid-cols-2">

              <Field
                label="Organization name"
                required
              >
                <div className="relative">
                  <Building2
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={
                      orgName
                    }
                    onChange={(event) =>
                      setOrgName(
                        event.target
                          .value
                      )
                    }
                    maxLength={200}
                    autoComplete="organization"
                    placeholder="Organization name"
                    className={`${inputClass} pl-10`}
                    required={
                      hasOrganization
                    }
                  />
                </div>
              </Field>

              <Field
                label="Organization type"
                required
              >
                <div className="relative">

                  <select
                    value={
                      orgType
                    }
                    onChange={(
                      event
                    ) =>
                      setOrgType(
                        event.target
                          .value as OrganizationType
                      )
                    }
                    className={
                      selectClass
                    }
                  >
                    {ORGANIZATION_TYPE_OPTIONS.map(
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

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>
              </Field>

              <Field
                label="Country"
              >
                <div className="relative">
                  <MapPin
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={
                      orgCountry
                    }
                    onChange={(event) =>
                      setOrgCountry(
                        event.target
                          .value
                      )
                    }
                    maxLength={120}
                    autoComplete="country-name"
                    placeholder="Country"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>

            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-8 text-center">

              <Building2
                size={21}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                No organization will be linked
              </p>

              <p className="mt-1 text-xs text-slate-400">
                The opportunity can remain independent.
              </p>

            </div>
          )}

        </FormSection>

        {/* ====================================================
            04 ASSIGNMENT
        ==================================================== */}

        <FormSection
          number="04"
          eyebrow="Workflow"
          title="Assignment"
          description="Optionally assign this opportunity to an authorized member of the workspace."
        >

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">

            <Field
              label="Responsible user"
              hint="Optional"
            >
              <div className="relative">

                <select
                  value={
                    assignedTo
                  }
                  onChange={(event) =>
                    setAssignedTo(
                      event.target
                        .value
                    )
                  }
                  className={
                    selectClass
                  }
                >
                  <option value="">
                    Not assigned
                  </option>

                  {profiles.map(
                    (profile) => (
                      <option
                        key={
                          profile.id
                        }
                        value={
                          profile.id
                        }
                      >
                        {profile.full_name ||
                          profile.email}
                        {' · '}
                        {profile.role.replace(
                          /_/g,
                          ' '
                        )}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>
            </Field>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:min-w-[290px]">

              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Current assignment
              </p>

              {selectedAssignee ? (
                <div className="mt-2 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-[10px] font-bold text-white">
                    {getInitials(
                      selectedAssignee.full_name,
                      selectedAssignee.email
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">
                      {
                        selectedAssignee.full_name ||
                        selectedAssignee.email
                      }
                    </p>

                    <p className="truncate text-[10px] text-slate-400">
                      {
                        selectedAssignee.role.replace(
                          /_/g,
                          ' '
                        )
                      }
                    </p>
                  </div>

                </div>
              ) : (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  No responsible user selected.
                </p>
              )}

            </div>

          </div>

          {!canAssignUsers && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">

              <CircleAlert
                size={15}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <p className="text-[11px] leading-5 text-amber-700">
                No assignable profile is currently visible to
                this account. The database RLS policies remain
                the final authority over profile access.
              </p>

            </div>
          )}

        </FormSection>

        {/* ====================================================
            SECURITY / SUMMARY
        ==================================================== */}

        <section className="rounded-[26px] border border-slate-200/80 bg-[#0A0C0B] p-5 text-white shadow-[0_15px_45px_rgba(10,12,11,0.12)] sm:p-7">

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D0A765]">
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D0A765]">
                  Secure submission
                </p>

                <h3 className="mt-1 text-sm font-semibold">
                  Ready to create this opportunity
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
                  The submission is checked against your
                  authenticated session and the database access
                  policies before it is written to the workspace.
                </p>

              </div>

            </div>

            <div className="flex flex-col gap-2 text-left lg:min-w-[270px]">

              <div className="flex items-center justify-between gap-5 text-[10px]">
                <span className="text-white/35">
                  Category
                </span>

                <span className="font-semibold text-white">
                  {
                    selectedCategory?.label
                  }
                </span>
              </div>

              <div className="flex items-center justify-between gap-5 text-[10px]">
                <span className="text-white/35">
                  Status
                </span>

                <span className="font-semibold text-white">
                  {
                    STATUS_OPTIONS.find(
                      (item) =>
                        item.value ===
                        status
                    )?.label
                  }
                </span>
              </div>

              <div className="flex items-center justify-between gap-5 text-[10px]">
                <span className="text-white/35">
                  Priority
                </span>

                <span className="font-semibold text-white">
                  {
                    PRIORITY_OPTIONS.find(
                      (item) =>
                        item.value ===
                        priority
                    )?.label
                  }
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div className="sticky bottom-4 z-20">

          <div className="flex flex-col justify-between gap-3 rounded-[22px] border border-slate-200 bg-white/95 p-3 shadow-[0_18px_60px_rgba(15,23,42,0.13)] backdrop-blur-xl sm:flex-row sm:items-center">

            <div className="flex items-center gap-3 px-2">

              <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex">
                <Save size={15} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-800">
                  {loading
                    ? 'Creating opportunity...'
                    : 'Ready to submit'}
                </p>

                <p className="text-[10px] text-slate-400">
                  All required information is checked before submission.
                </p>
              </div>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  router.back()
                }
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <ArrowLeft
                  size={14}
                />
                Previous
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus
                      size={15}
                    />
                    Create Opportunity
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