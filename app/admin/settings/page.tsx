'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  ShieldAlert,
  ShieldCheck,
  Trash2,
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

type NotificationSettings = {
  id: string
  email_recipients: string[]
  dashboard_alerts: boolean
  created_at: string
  updated_at: string
}

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: Role
}

type SettingsTab =
  | 'notifications'
  | 'general'
  | 'security'

/* ============================================================
   CONSTANTS
============================================================ */

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
]

const DEFAULT_NOTIFICATION_EMAIL =
  'ek.nsenga@gmail.com'

/* ============================================================
   HELPERS
============================================================ */

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  )
}

function roleLabel(role: Role | null) {
  if (!role) return 'Restricted'

  return role
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    )
}

/* ============================================================
   LOADING STATE
============================================================ */

function LoadingState({
  message = 'Loading settings...',
  description = 'Verifying access and preparing the administration workspace...',
}: {
  message?: string
  description?: string
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
          {description}
        </p>
      </div>
    </div>
  )
}

/* ============================================================
   ALERT
============================================================ */

function AlertMessage({
  type,
  message,
  onClose,
}: {
  type: 'error' | 'success'
  message: string
  onClose: () => void
}) {
  const isError = type === 'error'

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl px-4 py-4 ${
        isError
          ? 'border border-red-200 bg-red-50'
          : 'border border-emerald-200 bg-emerald-50'
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white ${
          isError
            ? 'text-red-600'
            : 'text-emerald-600'
        }`}
      >
        {isError ? (
          <ShieldAlert size={17} />
        ) : (
          <CheckCircle2 size={17} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            isError
              ? 'text-red-800'
              : 'text-emerald-800'
          }`}
        >
          {isError
            ? 'Operation failed'
            : 'Operation completed'}
        </p>

        <p
          className={`mt-1 text-xs leading-5 ${
            isError
              ? 'text-red-700/80'
              : 'text-emerald-700/80'
          }`}
        >
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className={`rounded-lg p-1 transition ${
          isError
            ? 'text-red-400 hover:bg-red-100 hover:text-red-700'
            : 'text-emerald-400 hover:bg-emerald-100 hover:text-emerald-700'
        }`}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  )
}

/* ============================================================
   SECTION
============================================================ */

function Section({
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

          <div className="min-w-0">
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

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  /* ----------------------------------------------------------
     ACCESS
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

  const [settings, setSettings] =
    useState<NotificationSettings | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  /* ----------------------------------------------------------
     MUTATIONS
  ---------------------------------------------------------- */

  const [saving, setSaving] =
    useState(false)

  const [mutatingRecipient, setMutatingRecipient] =
    useState<string | null>(null)

  const [togglingAlerts, setTogglingAlerts] =
    useState(false)

  /* ----------------------------------------------------------
     UI
  ---------------------------------------------------------- */

  const [error, setError] =
    useState<string | null>(null)

  const [success, setSuccess] =
    useState<string | null>(null)

  const [newEmail, setNewEmail] =
    useState('')

  const [dashboardAlerts, setDashboardAlerts] =
    useState(true)

  const [activeTab, setActiveTab] =
    useState<SettingsTab>('notifications')

  /* ==========================================================
     ACCESS VERIFICATION
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
            'Settings profile access error:',
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
          'Settings access verification error:',
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
     REVALIDATE CURRENT ADMIN
  ========================================================== */

  const revalidateAdmin =
    useCallback(
      async () => {
        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          throw new Error(
            'Your session has expired. Please sign in again.'
          )
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
          throw new Error(
            'Unable to verify your current account.'
          )
        }

        const typedProfile =
          currentProfile as Profile

        if (
          !AUTHORIZED_ROLES.includes(
            typedProfile.role
          )
        ) {
          setAuthorized(false)

          throw new Error(
            'Your current account is no longer authorized to manage settings.'
          )
        }

        setProfile(
          typedProfile
        )

        return user
      },
      [router, supabase]
    )

  /* ==========================================================
     LOAD SETTINGS
  ========================================================== */

  const loadSettings = useCallback(
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
        const {
          data,
          error: settingsError,
        } =
          await supabase
            .from(
              'notification_settings'
            )
            .select(
              'id, email_recipients, dashboard_alerts, created_at, updated_at'
            )
            .limit(1)
            .maybeSingle()

        if (
          settingsError &&
          settingsError.code !==
            'PGRST116'
        ) {
          console.error(
            'Notification settings loading error:',
            settingsError
          )

          throw new Error(
            'Unable to load notification settings.'
          )
        }

        if (data) {
          const typedSettings =
            data as NotificationSettings

          setSettings(
            typedSettings
          )

          setDashboardAlerts(
            typedSettings.dashboard_alerts
          )

          return
        }

        /*
         * No settings record exists yet.
         * We preserve the existing application logic
         * and create the initial record.
         */
        const {
          data: createdSettings,
          error: createError,
        } =
          await supabase
            .from(
              'notification_settings'
            )
            .insert({
              email_recipients: [
                DEFAULT_NOTIFICATION_EMAIL,
              ],
              dashboard_alerts:
                true,
            })
            .select(
              'id, email_recipients, dashboard_alerts, created_at, updated_at'
            )
            .maybeSingle()

        if (createError) {
          console.error(
            'Default notification settings creation error:',
            createError
          )

          throw new Error(
            'Unable to initialize notification settings.'
          )
        }

        if (createdSettings) {
          const typedSettings =
            createdSettings as NotificationSettings

          setSettings(
            typedSettings
          )

          setDashboardAlerts(
            typedSettings.dashboard_alerts
          )
        }
      } catch (loadError) {
        console.error(
          'Settings loading failed:',
          loadError
        )

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load settings.'
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [authorized, supabase]
  )

  useEffect(() => {
    if (authorized) {
      loadSettings()
    }
  }, [
    authorized,
    loadSettings,
  ])

  /* ==========================================================
     DERIVED
  ========================================================== */

  const recipientCount =
    settings?.email_recipients
      .length ?? 0

  const lastUpdated =
    useMemo(() => {
      if (!settings?.updated_at) {
        return '—'
      }

      const date =
        new Date(
          settings.updated_at
        )

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
    }, [settings])

  /* ==========================================================
     ADD RECIPIENT
  ========================================================== */

  const handleAddEmail =
    async () => {
      if (
        !settings ||
        mutatingRecipient
      ) {
        return
      }

      const email =
        newEmail
          .trim()
          .toLowerCase()

      if (!email) {
        setError(
          'Please enter an email address.'
        )
        return
      }

      if (!isValidEmail(email)) {
        setError(
          'Please enter a valid email address.'
        )
        return
      }

      if (
        settings.email_recipients.includes(
          email
        )
      ) {
        setError(
          'This email is already in the recipient list.'
        )
        return
      }

      setError(null)
      setSuccess(null)
      setMutatingRecipient(
        email
      )

      try {
        await revalidateAdmin()

        const updatedRecipients =
          Array.from(
            new Set([
              ...settings.email_recipients,
              email,
            ])
          )

        const now =
          new Date().toISOString()

        const {
          data,
          error:
            updateError,
        } =
          await supabase
            .from(
              'notification_settings'
            )
            .update({
              email_recipients:
                updatedRecipients,
              updated_at:
                now,
            })
            .eq(
              'id',
              settings.id
            )
            .select(
              'id, email_recipients, dashboard_alerts, created_at, updated_at'
            )
            .single()

        if (updateError) {
          console.error(
            'Add recipient error:',
            updateError
          )

          throw new Error(
            'Unable to add notification recipient.'
          )
        }

        const nextSettings =
          data as NotificationSettings

        setSettings(
          nextSettings
        )

        setDashboardAlerts(
          nextSettings.dashboard_alerts
        )

        setNewEmail('')

        setSuccess(
          `"${email}" was added to notification recipients.`
        )
      } catch (addError) {
        console.error(
          'Recipient addition failed:',
          addError
        )

        setError(
          addError instanceof Error
            ? addError.message
            : 'Unable to add recipient.'
        )
      } finally {
        setMutatingRecipient(
          null
        )
      }
    }

  /* ==========================================================
     REMOVE RECIPIENT
  ========================================================== */

  const handleRemoveEmail =
    async (
      email: string
    ) => {
      if (
        !settings ||
        mutatingRecipient
      ) {
        return
      }

      if (
        settings.email_recipients
          .length <= 1
      ) {
        setError(
          'At least one notification recipient must remain configured.'
        )
        return
      }

      const confirmed =
        window.confirm(
          `Remove "${email}" from notification recipients?`
        )

      if (!confirmed) {
        return
      }

      setError(null)
      setSuccess(null)
      setMutatingRecipient(
        email
      )

      try {
        await revalidateAdmin()

        const updatedRecipients =
          settings.email_recipients.filter(
            (item) =>
              item !== email
          )

        const now =
          new Date().toISOString()

        const {
          data,
          error:
            updateError,
        } =
          await supabase
            .from(
              'notification_settings'
            )
            .update({
              email_recipients:
                updatedRecipients,
              updated_at:
                now,
            })
            .eq(
              'id',
              settings.id
            )
            .select(
              'id, email_recipients, dashboard_alerts, created_at, updated_at'
            )
            .single()

        if (updateError) {
          console.error(
            'Remove recipient error:',
            updateError
          )

          throw new Error(
            'Unable to remove notification recipient.'
          )
        }

        const nextSettings =
          data as NotificationSettings

        setSettings(
          nextSettings
        )

        setDashboardAlerts(
          nextSettings.dashboard_alerts
        )

        setSuccess(
          `"${email}" was removed from notification recipients.`
        )
      } catch (removeError) {
        console.error(
          'Recipient removal failed:',
          removeError
        )

        setError(
          removeError instanceof Error
            ? removeError.message
            : 'Unable to remove recipient.'
        )
      } finally {
        setMutatingRecipient(
          null
        )
      }
    }

  /* ==========================================================
     TOGGLE DASHBOARD ALERTS
  ========================================================== */

  const handleToggleDashboardAlerts =
    async () => {
      if (
        !settings ||
        togglingAlerts
      ) {
        return
      }

      setError(null)
      setSuccess(null)
      setTogglingAlerts(true)

      const nextValue =
        !dashboardAlerts

      try {
        await revalidateAdmin()

        const now =
          new Date().toISOString()

        const {
          data,
          error:
            updateError,
        } =
          await supabase
            .from(
              'notification_settings'
            )
            .update({
              dashboard_alerts:
                nextValue,
              updated_at:
                now,
            })
            .eq(
              'id',
              settings.id
            )
            .select(
              'id, email_recipients, dashboard_alerts, created_at, updated_at'
            )
            .single()

        if (updateError) {
          console.error(
            'Dashboard alerts update error:',
            updateError
          )

          throw new Error(
            'Unable to update dashboard alerts.'
          )
        }

        const nextSettings =
          data as NotificationSettings

        setSettings(
          nextSettings
        )

        setDashboardAlerts(
          nextSettings.dashboard_alerts
        )

        setSuccess(
          `Dashboard alerts ${
            nextSettings.dashboard_alerts
              ? 'enabled'
              : 'disabled'
          }.`
        )
      } catch (toggleError) {
        console.error(
          'Dashboard alert update failed:',
          toggleError
        )

        setError(
          toggleError instanceof Error
            ? toggleError.message
            : 'Unable to update dashboard alerts.'
        )
      } finally {
        setTogglingAlerts(
          false
        )
      }
    }

  /* ==========================================================
     SAVE ALL
  ========================================================== */

  const handleSaveAll =
    async () => {
      if (
        !settings ||
        saving
      ) {
        return
      }

      setSaving(true)
      setError(null)
      setSuccess(null)

      try {
        await revalidateAdmin()

        const now =
          new Date().toISOString()

        const {
          data,
          error:
            updateError,
        } =
          await supabase
            .from(
              'notification_settings'
            )
            .update({
              email_recipients:
                settings.email_recipients,
              dashboard_alerts:
                dashboardAlerts,
              updated_at:
                now,
            })
            .eq(
              'id',
              settings.id
            )
            .select(
              'id, email_recipients, dashboard_alerts, created_at, updated_at'
            )
            .single()

        if (updateError) {
          console.error(
            'Settings save error:',
            updateError
          )

          throw new Error(
            'Unable to save settings.'
          )
        }

        const updatedSettings =
          data as NotificationSettings

        setSettings(
          updatedSettings
        )

        setDashboardAlerts(
          updatedSettings.dashboard_alerts
        )

        setSuccess(
          'Settings saved successfully.'
        )
      } catch (saveError) {
        console.error(
          'Settings save failed:',
          saveError
        )

        setError(
          saveError instanceof Error
            ? saveError.message
            : 'Unable to save settings.'
        )
      } finally {
        setSaving(false)
      }
    }

  /* ==========================================================
     LOADING
  ========================================================== */

  if (checkingAccess) {
    return (
      <LoadingState
        message="Verifying secure access..."
        description="Checking your administration privileges..."
      />
    )
  }

  /* ==========================================================
     ACCESS DENIED
  ========================================================== */

  if (!authorized) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">

        <div className="w-full max-w-md rounded-[30px] border border-red-200 bg-white p-8 text-center shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert size={23} />
          </div>

          <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.28em] text-red-600">
            Administration security
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
            Access restricted
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your current account does not have permission to manage system settings.
          </p>

          {profile?.email && (
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Authenticated account
              </p>

              <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                {profile.email}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                {roleLabel(profile.role)}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              router.replace('/admin')
            }
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-5 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800"
          >
            <ArrowLeft size={14} />
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  /* ==========================================================
     DATA LOADING
  ========================================================== */

  if (loading) {
    return (
      <LoadingState
        message="Loading secure settings..."
        description="Preparing your administration configuration..."
      />
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
            Settings
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

            <div className="min-w-0">

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
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage notification preferences and future administration configuration for the Barack Mining Investment workspace.
              </p>

            </div>
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                loadSettings(true)
              }
              disabled={
                refreshing ||
                saving
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              onClick={handleSaveAll}
              disabled={
                saving ||
                !settings
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.15)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
              ) : (
                <Save size={15} />
              )}

              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>
        </div>
      </section>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={() =>
            setError(null)
          }
        />
      )}

      {success && (
        <AlertMessage
          type="success"
          message={success}
          onClose={() =>
            setSuccess(null)
          }
        />
      )}

      {/* ======================================================
          ACCOUNT / SECURITY META
      ====================================================== */}

      <section className="grid gap-3 sm:grid-cols-3">

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Current administrator
          </p>

          <p className="mt-2 truncate text-sm font-semibold text-slate-900">
            {profile?.full_name ||
              profile?.email ||
              'Administrator'}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {roleLabel(profile?.role ?? null)}
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Recipients
            </p>

            <Mail
              size={15}
              className="text-slate-400"
            />
          </div>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {recipientCount}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Notification destinations
          </p>
        </div>

        <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Last updated
            </p>

            <RefreshCw
              size={15}
              className="text-slate-400"
            />
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {lastUpdated}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            Notification configuration
          </p>
        </div>

      </section>

      {/* ======================================================
          TABS
      ====================================================== */}

      <div className="overflow-x-auto">
        <div className="flex min-w-max rounded-[18px] border border-slate-200 bg-white p-1 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                'notifications'
              )
            }
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${
              activeTab === 'notifications'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bell size={15} />
            Notifications
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                'general'
              )
            }
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${
              activeTab === 'general'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <SettingsIcon size={15} />
            General
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                'security'
              )
            }
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition ${
              activeTab === 'security'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck size={15} />
            Security
          </button>

        </div>
      </div>

      {/* ======================================================
          NOTIFICATIONS
      ====================================================== */}

      {activeTab ===
        'notifications' &&
        settings && (
          <div className="space-y-6">

            {/* ALERTS */}

            <Section
              number="01"
              eyebrow="Notifications"
              title="Dashboard alerts"
              description="Control whether notification indicators remain visible in the administration dashboard."
            >

              <div className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 sm:flex-row sm:items-center">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm">
                    <Bell size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Dashboard Alerts
                    </p>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                      Show notification indicators on the administration dashboard when supported by the application workflow.
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${
                          dashboardAlerts
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {dashboardAlerts
                          ? 'Enabled'
                          : 'Disabled'}
                      </span>
                    </div>
                  </div>

                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    dashboardAlerts
                  }
                  onClick={
                    handleToggleDashboardAlerts
                  }
                  disabled={
                    togglingAlerts
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${
                    dashboardAlerts
                      ? 'bg-emerald-500'
                      : 'bg-slate-300'
                  } ${
                    togglingAlerts
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      dashboardAlerts
                        ? 'left-6'
                        : 'left-1'
                    }`}
                  />
                </button>

              </div>
            </Section>

            {/* RECIPIENTS */}

            <Section
              number="02"
              eyebrow="Delivery"
              title="Email recipients"
              description="Manage the addresses that receive notification emails related to workspace activity."
            >

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                    <Mail size={17} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Notification destinations
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      At least one recipient must remain configured.
                    </p>
                  </div>

                </div>

                <div className="mt-5 space-y-2">

                  {settings.email_recipients.map(
                    (
                      email
                    ) => {
                      const busy =
                        mutatingRecipient ===
                        email

                      return (
                        <div
                          key={email}
                          className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                        >

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                              <Mail size={15} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
                                {email}
                              </p>

                              <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-slate-400">
                                Active recipient
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveEmail(
                                email
                              )
                            }
                            disabled={
                              settings
                                .email_recipients
                                .length <=
                                1 ||
                              busy
                            }
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {busy ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                            ) : (
                              <Trash2 size={14} />
                            )}

                            Remove
                          </button>

                        </div>
                      )
                    }
                  )}

                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">

                  <div className="relative flex-1">
                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={newEmail}
                      onChange={(event) =>
                        setNewEmail(
                          event.target.value
                        )
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          'Enter'
                        ) {
                          event.preventDefault()
                          handleAddEmail()
                        }
                      }}
                      placeholder="Add email address..."
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#A98B4F] focus:ring-4 focus:ring-[#A98B4F]/10"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleAddEmail
                    }
                    disabled={
                      !newEmail.trim() ||
                      Boolean(
                        mutatingRecipient
                      )
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-xs font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.12)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {mutatingRecipient ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                    ) : (
                      <Plus size={15} />
                    )}

                    Add recipient
                  </button>

                </div>

              </div>
            </Section>

            {/* SAVE SUMMARY */}

            <section className="rounded-[26px] border border-slate-200/80 bg-[#0A0C0B] p-5 text-white shadow-[0_15px_45px_rgba(10,12,11,0.12)] sm:p-7">

              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">

                <div className="flex items-start gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#D0A765]">
                    <ShieldCheck size={20} />
                  </div>

                  <div>

                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D0A765]">
                      Secure configuration
                    </p>

                    <h3 className="mt-1 text-sm font-semibold">
                      Notification configuration
                    </h3>

                    <p className="mt-1 max-w-2xl text-xs leading-5 text-white/45">
                      Settings mutations are revalidated against the authenticated account before being written to Supabase.
                    </p>

                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:min-w-[280px]">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Current state
                  </p>

                  <div className="mt-3 space-y-2">

                    <div className="flex items-center justify-between gap-4 text-[10px]">
                      <span className="text-white/35">
                        Dashboard alerts
                      </span>

                      <span className="font-semibold text-white">
                        {dashboardAlerts
                          ? 'Enabled'
                          : 'Disabled'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-[10px]">
                      <span className="text-white/35">
                        Recipients
                      </span>

                      <span className="font-semibold text-white">
                        {recipientCount}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-[10px]">
                      <span className="text-white/35">
                        Access
                      </span>

                      <span className="font-semibold text-emerald-300">
                        Authorized
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            </section>

          </div>
        )}

      {/* ======================================================
          GENERAL
      ====================================================== */}

      {activeTab ===
        'general' && (
          <Section
            number="01"
            eyebrow="General"
            title="General settings"
            description="Reserved for future global configuration of the Barack Mining Investment administration workspace."
          >

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <SettingsIcon size={24} />
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                General configuration
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                This area is intentionally reserved for future company and workspace configuration. No unsupported settings are exposed here.
              </p>

              <span className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Not configured yet
              </span>

            </div>

          </Section>
        )}

      {/* ======================================================
          SECURITY
      ====================================================== */}

      {activeTab ===
        'security' && (
          <Section
            number="01"
            eyebrow="Security"
            title="Security settings"
            description="Security controls that can be introduced without weakening the current authentication and RLS model."
          >

            <div className="space-y-4">

              <div className="flex items-start gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600">
                  <ShieldCheck size={18} />
                </div>

                <div>

                  <p className="text-sm font-semibold text-emerald-800">
                    Role-protected administration
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700/80">
                    This page is restricted to Super Admin and Administrator roles, while Supabase RLS remains the final database-level authority.
                  </p>

                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Current role
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {roleLabel(
                      profile?.role ??
                        null
                    )}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Current authenticated authorization level.
                  </p>

                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">

                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Session
                  </p>

                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    Authenticated
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Session state is monitored and sign-out is enforced by the authenticated client.
                  </p>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">

                <div className="flex items-start gap-4">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <ShieldAlert size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Future security controls
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      MFA administration, session policies and advanced access controls should only be enabled once their corresponding backend policies are implemented.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </Section>
        )}

      {/* ======================================================
          SECURITY FOOTER
      ====================================================== */}

      <section className="flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.03)] sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={16} />
          </div>

          <div>

            <p className="text-xs font-semibold text-slate-800">
              Protected settings management
            </p>

            <p className="mt-0.5 text-[10px] leading-5 text-slate-400">
              Access is checked against the authenticated account before sensitive settings mutations are performed.
            </p>

          </div>
        </div>

        <div className="text-left sm:text-right">

          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Current role
          </p>

          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {roleLabel(
              profile?.role ??
                null
            )}
          </p>

        </div>

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
            loadSettings(true)
          }
          disabled={
            refreshing ||
            saving
          }
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={
              refreshing
                ? 'animate-spin'
                : ''
            }
          />
          Refresh configuration
        </button>

      </div>

    </div>
  )
}