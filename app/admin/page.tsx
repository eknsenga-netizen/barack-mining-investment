'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  Zap,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role:
    | 'super_admin'
    | 'admin'
    | 'opportunity_manager'
    | 'content_manager'
    | 'operations_manager'
    | 'viewer'
  avatar_url: string | null
}

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

type AuditLog = {
  id: string
  user_id: string | null
  action: string
  target_type: string | null
  target_id: string | null
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

type NotificationSettings = {
  id: string
  email_recipients: string[]
  dashboard_alerts: boolean
  created_at: string
  updated_at: string
}

const PIPELINE_STAGES = [
  {
    key: 'new',
    label: 'New',
    shortLabel: 'New',
  },
  {
    key: 'under_review',
    label: 'Under Review',
    shortLabel: 'Review',
  },
  {
    key: 'awaiting_information',
    label: 'Awaiting Information',
    shortLabel: 'Info',
  },
  {
    key: 'qualified',
    label: 'Qualified',
    shortLabel: 'Qualified',
  },
  {
    key: 'assigned',
    label: 'Assigned',
    shortLabel: 'Assigned',
  },
  {
    key: 'in_discussion',
    label: 'In Discussion',
    shortLabel: 'Discussion',
  },
  {
    key: 'active',
    label: 'Active',
    shortLabel: 'Active',
  },
  {
    key: 'closed',
    label: 'Closed',
    shortLabel: 'Closed',
  },
] as const

const ROLE_LABELS: Record<UserProfile['role'], string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  opportunity_manager: 'Opportunity Manager',
  content_manager: 'Content Manager',
  operations_manager: 'Operations Manager',
  viewer: 'Viewer',
}

const CATEGORY_LABELS: Record<Opportunity['category'], string> = {
  investor: 'Investor',
  concession: 'Asset / Concession',
  mineral_supply: 'Mineral Supply',
  mining_company: 'Mining Company',
  strategic_partner: 'Strategic Partner',
  other: 'Other',
}

const STATUS_LABELS: Record<Opportunity['status'], string> = {
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

type NavigationItem = {
  label: string
  path: string
  icon: typeof LayoutDashboard
  active?: boolean
  badge?: boolean
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: 'Opportunities',
    path: '/admin/opportunities',
    icon: BriefcaseBusiness,
    badge: true,
  },
  {
    label: 'Relationships',
    path: '/admin/relationships',
    icon: Users,
  },
  {
    label: 'Content',
    path: '/admin/content',
    icon: FileText,
  },
  {
    label: 'Media',
    path: '/admin/media',
    icon: Zap,
  },
  {
    label: 'Impact',
    path: '/admin/impact',
    icon: Activity,
  },
]

const ADMIN_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Users & Roles',
    path: '/admin/users',
    icon: ShieldCheck,
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings,
  },
]

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatRelativeTime(value: string | null | undefined) {
  if (!value) return '—'

  const date = new Date(value)
  const diff = Date.now() - date.getTime()

  const minutes = Math.floor(diff / 1000 / 60)
  const hours = Math.floor(diff / 1000 / 60 / 60)
  const days = Math.floor(diff / 1000 / 60 / 60 / 24)

  if (minutes < 1) return 'Just now'

  if (minutes < 60) {
    return `${minutes}m ago`
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
  name: string | null,
  email: string | null
) {
  const value =
    name?.trim() ||
    email?.trim() ||
    'BM'

  const parts = value.split(/\s+/).filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function getPriorityClass(
  priority: Opportunity['priority']
) {
  switch (priority) {
    case 'high':
      return 'border-red-200 bg-red-50 text-red-700'

    case 'medium':
      return 'border-amber-200 bg-amber-50 text-amber-700'

    default:
      return 'border-slate-200 bg-slate-50 text-slate-600'
  }
}

function getStatusClass(
  status: Opportunity['status']
) {
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

function getActionLabel(action: string) {
  return action
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
        {eyebrow}
      </p>

      <h3 className="mt-1 text-lg font-semibold text-slate-950">
        {title}
      </h3>

      {description && (
        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  description,
  icon,
  onClick,
}: {
  label: string
  value: number
  description: string
  icon: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-[22px] border border-slate-200/80 bg-white p-5 text-left shadow-[0_10px_35px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.07)]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
          {icon}
        </div>

        <ArrowRight
          size={17}
          className="mt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
        />
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>

        <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
          {value}
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </button>
  )
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-900">
        {title}
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

function NavigationButton({
  label,
  icon: Icon,
  onClick,
  active = false,
  badge,
}: {
  label: string
  icon: typeof LayoutDashboard
  onClick: () => void
  active?: boolean
  badge?: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? 'bg-white/[0.08] text-white'
          : 'text-white/50 hover:bg-white/[0.05] hover:text-white'
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </span>

      {badge !== undefined && (
        <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-white/50">
          {badge}
        </span>
      )}
    </button>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] =
    useState<UserProfile | null>(null)

  const [opportunities, setOpportunities] =
    useState<Opportunity[]>([])

  const [auditLogs, setAuditLogs] =
    useState<AuditLog[]>([])

  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [refreshing, setRefreshing] =
    useState(false)

  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  const [searchOpen, setSearchOpen] =
    useState(false)

  const [search, setSearch] =
    useState('')

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false)

  const loadDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true)
        } else {
          setLoading(true)
        }

        const {
          data: {
            user: authUser,
          },
        } = await supabase.auth.getUser()

        if (!authUser) {
          router.replace('/login')
          return
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from('profiles')
          .select(
            'id, email, full_name, role, avatar_url'
          )
          .eq('id', authUser.id)
          .maybeSingle()

        if (profileError) {
          console.error(
            'Profile loading error:',
            profileError
          )
        }

        if (!profile) {
          router.replace('/login')
          return
        }

        setUser(profile as UserProfile)

        const canManageOpportunities = [
          'super_admin',
          'admin',
          'opportunity_manager',
        ].includes(profile.role)

        const canViewAudit = [
          'super_admin',
          'admin',
        ].includes(profile.role)

        let opportunitiesData: Opportunity[] = []
        let auditData: AuditLog[] = []
        let notificationData: NotificationSettings | null = null

        if (canManageOpportunities) {
          const { data, error } = await supabase
            .from('opportunities')
            .select(
              [
                'id',
                'reference',
                'category',
                'status',
                'priority',
                'contact_id',
                'organization_id',
                'description',
                'assigned_to',
                'submitted_at',
                'updated_at',
                'closed_at',
                'source',
                'metadata',
              ].join(', ')
            )
            .order('submitted_at', {
              ascending: false,
            })

          if (error) {
            console.error(
              'Opportunities loading error:',
              error
            )
          } else {
            opportunitiesData =
              (data as unknown as Opportunity[]) ?? []
          }
        }

        if (canViewAudit) {
          const { data, error } = await supabase
            .from('audit_logs')
            .select(
              [
                'id',
                'user_id',
                'action',
                'target_type',
                'target_id',
                'metadata',
                'ip_address',
                'created_at',
              ].join(', ')
            )
            .order('created_at', {
              ascending: false,
            })
            .limit(8)

          if (error) {
            console.error(
              'Audit logs loading error:',
              error
            )
          } else {
            auditData =
              (data as unknown as AuditLog[]) ?? []
          }

          const {
            data: notifData,
            error: notifError,
          } = await supabase
            .from('notification_settings')
            .select(
              [
                'id',
                'email_recipients',
                'dashboard_alerts',
                'created_at',
                'updated_at',
              ].join(', ')
            )
            .order('created_at', {
              ascending: false,
            })
            .limit(1)

          if (notifError) {
            console.error(
              'Notification settings loading error:',
              notifError
            )
          } else {
            notificationData =
              (notifData?.[0] as unknown as NotificationSettings) ??
              null
          }
        }

        setOpportunities(opportunitiesData)
        setAuditLogs(auditData)
        setNotificationSettings(notificationData)
      } catch (error) {
        console.error(
          'Dashboard loading error:',
          error
        )
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [router, supabase]
  )

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  useEffect(() => {
    const {
      data: {
        subscription,
      },
    } = supabase.auth.onAuthStateChange(
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

  const stats = useMemo(() => {
    const newCount =
      opportunities.filter(
        (item) => item.status === 'new'
      ).length

    const reviewCount =
      opportunities.filter(
        (item) => item.status === 'under_review'
      ).length

    const activeCount =
      opportunities.filter(
        (item) => item.status === 'active'
      ).length

    const closedCount =
      opportunities.filter(
        (item) => item.status === 'closed'
      ).length

    const highPriorityCount =
      opportunities.filter(
        (item) => item.priority === 'high'
      ).length

    return {
      total: opportunities.length,
      newCount,
      reviewCount,
      activeCount,
      closedCount,
      highPriorityCount,
    }
  }, [opportunities])

  const pipeline = useMemo(
    () => {
      return PIPELINE_STAGES.map((stage) => ({
        ...stage,
        count: opportunities.filter(
          (item) => item.status === stage.key
        ).length,
      }))
    },
    [opportunities]
  )

  const priorityQueue = useMemo(
    () => {
      return opportunities
        .filter(
          (item) =>
            item.priority === 'high' ||
            item.status === 'under_review' ||
            item.status === 'awaiting_information'
        )
        .slice(0, 7)
    },
    [opportunities]
  )

  const filteredOpportunities = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return opportunities

    return opportunities.filter(
      (item) => {
        return (
          item.reference
            .toLowerCase()
            .includes(term) ||
          CATEGORY_LABELS[item.category]
            .toLowerCase()
            .includes(term) ||
          STATUS_LABELS[item.status]
            .toLowerCase()
            .includes(term) ||
          item.priority
            .toLowerCase()
            .includes(term)
        )
      }
    )
  }, [opportunities, search])

  const hasNotificationRecipients =
    Boolean(
      notificationSettings?.email_recipients
        ?.length
    )

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
    []
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()

    router.replace('/login')
    router.refresh()
  }

  const navigate = (path: string) => {
    setSidebarOpen(false)
    router.push(path)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F5F7]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <Image
              src="/images/logo-bmi.png"
              alt="Barack Mining Investment"
              width={64}
              height={64}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div className="mt-5">
            <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900">
            Loading Administration Hub
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Preparing your secure workspace...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-950">

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-[#090B0A] text-white shadow-2xl transition-transform duration-300 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-[82px] items-center border-b border-white/8 px-5">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-bmi.png"
              alt="BMI"
              width={44}
              height={44}
              priority
              className="h-11 w-auto"
            />

            <div>
              <p className="text-sm font-semibold tracking-[0.12em]">
                BARACK MINING
              </p>

              <p className="mt-0.5 text-[9px] uppercase tracking-[0.32em] text-white/35">
                Administration Hub
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="ml-auto rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/25">
            Workspace
          </p>

          <nav className="mt-3 space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <NavigationButton
                key={item.path}
                label={item.label}
                icon={item.icon}
                active={item.active}
                badge={
                  item.badge
                    ? stats.total
                    : undefined
                }
                onClick={() =>
                  navigate(item.path)
                }
              />
            ))}
          </nav>

          <p className="mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.3em] text-white/25">
            Administration
          </p>

          <nav className="mt-3 space-y-1">
            {ADMIN_NAVIGATION_ITEMS.map(
              (item) => (
                <NavigationButton
                  key={item.path}
                  label={item.label}
                  icon={item.icon}
                  onClick={() =>
                    navigate(item.path)
                  }
                />
              )
            )}
          </nav>
        </div>

        <div className="border-t border-white/8 p-4">
          <button
            type="button"
            onClick={() =>
              navigate('/admin/profile')
            }
            className="mb-3 flex w-full items-center gap-3 rounded-xl bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.07]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#D0A765] text-xs font-bold text-[#0A0C0B]">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name ?? ''}
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
              <p className="truncate text-sm font-semibold text-white">
                {user.full_name ||
                  'Administrator'}
              </p>

              <p className="truncate text-[11px] text-white/35">
                {ROLE_LABELS[user.role]}
              </p>
            </div>

            <ChevronDown
              size={14}
              className="ml-auto text-white/30"
            />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/40 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[272px]">

        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#F4F5F7]/90 backdrop-blur-xl">
          <div className="flex h-[78px] items-center justify-between px-4 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 lg:hidden"
              >
                <Menu size={18} />
              </button>

              <div>
                <p className="hidden text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-400 sm:block">
                  Private Administration
                </p>

                <h1 className="text-lg font-semibold tracking-[-0.02em] text-slate-950 sm:text-xl">
                  Intelligence Hub
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(
                    (value) => !value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              >
                <Search size={18} />
              </button>

              <button
                type="button"
                onClick={() =>
                  loadDashboard(true)
                }
                disabled={refreshing}
                className="hidden rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-slate-300 hover:text-slate-950 sm:block"
              >
                <RefreshCw
                  size={18}
                  className={
                    refreshing
                      ? 'animate-spin'
                      : ''
                  }
                />
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setNotificationsOpen(
                      (value) => !value
                    )
                  }
                  className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <Bell size={18} />

                  {notificationSettings?.dashboard_alerts && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#B87333] ring-2 ring-white" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 top-14 w-[330px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_65px_rgba(15,23,42,0.15)]">

                    <div className="border-b border-slate-100 px-5 py-4">
                      <p className="text-sm font-semibold text-slate-950">
                        Notification settings
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Opportunity submission alerts and
                        dashboard notifications.
                      </p>
                    </div>

                    <div className="p-5">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">
                            Dashboard alerts
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                              notificationSettings?.dashboard_alerts
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {notificationSettings?.dashboard_alerts
                              ? 'Enabled'
                              : 'Disabled'}
                          </span>
                        </div>

                        <div className="mt-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Email recipients
                          </p>

                          <div className="mt-2 space-y-1">
                            {hasNotificationRecipients ? (
                              notificationSettings!.email_recipients.map(
                                (email) => (
                                  <p
                                    key={email}
                                    className="truncate text-xs text-slate-600"
                                  >
                                    {email}
                                  </p>
                                )
                              )
                            ) : (
                              <p className="text-xs text-slate-400">
                                No recipient configured
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            '/admin/settings/notifications'
                          )
                        }
                        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-xs font-semibold text-white transition hover:bg-slate-800"
                      >
                        Manage notifications
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden h-8 w-px bg-slate-200 sm:block" />

              <button
                type="button"
                onClick={() =>
                  navigate('/admin/profile')
                }
                className="hidden items-center gap-2 sm:flex"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-[10px] font-semibold text-white">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name ?? ''}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(
                      user.full_name,
                      user.email
                    )
                  )}
                </div>

                <div className="hidden text-left lg:block">
                  <p className="max-w-[145px] truncate text-xs font-semibold text-slate-900">
                    {user.full_name ||
                      'Administrator'}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {ROLE_LABELS[user.role]}
                  </p>
                </div>

                <ChevronDown
                  size={14}
                  className="text-slate-400"
                />
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-slate-200/80 px-4 py-3 sm:px-6 lg:px-8">
              <div className="relative max-w-2xl">

                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  autoFocus
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search reference, category, status..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />
              </div>
            </div>
          )}
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1540px]">

            <section className="mb-8">
              <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">

                <div>
                  <p className="text-xs font-medium text-slate-400">
                    {today}
                  </p>

                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                    Good morning,{' '}
                    {(
                      user.full_name ||
                      'Administrator'
                    ).split(' ')[0]}
                    .
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    A clear view of the opportunities,
                    actions and activity across Barack Mining
                    Investment.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/admin/opportunities'
                      )
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <BriefcaseBusiness
                      size={16}
                    />
                    View opportunities
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/admin/opportunities/new'
                      )
                    }
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0A0C0B] px-4 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(10,12,11,0.16)] transition hover:bg-slate-800"
                  >
                    <Zap size={16} />
                    New opportunity
                  </button>
                </div>

              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-end justify-between">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-500">
                    Action Center
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-950">
                    What needs attention
                  </h3>
                </div>

                <span className="text-xs text-slate-400">
                  Live workspace signals
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-3">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/admin/opportunities?priority=high'
                    )
                  }
                  className="group rounded-[22px] border border-red-200 bg-gradient-to-br from-red-50 to-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                      <AlertCircle size={18} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-red-300 transition group-hover:translate-x-1 group-hover:text-red-500"
                    />
                  </div>

                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500">
                    High priority
                  </p>

                  <p className="mt-1 text-3xl font-semibold tracking-tight text-red-950">
                    {stats.highPriorityCount}
                  </p>

                  <p className="mt-1 text-xs text-red-700/60">
                    Opportunities requiring attention.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/admin/opportunities?status=under_review'
                    )
                  }
                  className="group rounded-[22px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Clock3 size={18} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-amber-300 transition group-hover:translate-x-1 group-hover:text-amber-500"
                    />
                  </div>

                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-600">
                    Awaiting review
                  </p>

                  <p className="mt-1 text-3xl font-semibold tracking-tight text-amber-950">
                    {stats.reviewCount}
                  </p>

                  <p className="mt-1 text-xs text-amber-700/60">
                    Opportunities currently under review.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/admin/settings/notifications'
                    )
                  }
                  className="group rounded-[22px] border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Bell size={18} />
                    </div>

                    <ArrowRight
                      size={16}
                      className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
                    />
                  </div>

                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Notification system
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    {notificationSettings
                      ?.dashboard_alerts
                      ? 'Active'
                      : 'Inactive'}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {hasNotificationRecipients
                      ? `${notificationSettings!.email_recipients.length} recipient(s) configured`
                      : 'No recipients configured'}
                  </p>
                </button>

              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4">
                <SectionHeading
                  eyebrow="Overview"
                  title="Workspace overview"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatCard
                  label="Total opportunities"
                  value={stats.total}
                  description="All opportunities currently stored in the workspace."
                  icon={
                    <BriefcaseBusiness
                      size={19}
                    />
                  }
                  onClick={() =>
                    navigate(
                      '/admin/opportunities'
                    )
                  }
                />

                <StatCard
                  label="New"
                  value={stats.newCount}
                  description="New submissions awaiting initial handling."
                  icon={
                    <Zap size={19} />
                  }
                  onClick={() =>
                    navigate(
                      '/admin/opportunities?status=new'
                    )
                  }
                />

                <StatCard
                  label="Active"
                  value={stats.activeCount}
                  description="Opportunities currently active or progressing."
                  icon={
                    <Activity size={19} />
                  }
                  onClick={() =>
                    navigate(
                      '/admin/opportunities?status=active'
                    )
                  }
                />

                <StatCard
                  label="Closed"
                  value={stats.closedCount}
                  description="Opportunities that have reached a closed state."
                  icon={
                    <CheckCircle2
                      size={19}
                    />
                  }
                  onClick={() =>
                    navigate(
                      '/admin/opportunities?status=closed'
                    )
                  }
                />

              </div>
            </section>

            <section className="mb-8 rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:p-6">

              <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                <SectionHeading
                  eyebrow="Opportunity Pipeline"
                  title="Opportunity flow"
                  description="The complete lifecycle from first submission to closure."
                />

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/admin/opportunities'
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition hover:text-slate-950"
                >
                  Manage pipeline
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="mt-6 overflow-x-auto pb-1">
                <div className="grid min-w-[860px] grid-cols-8 gap-2">

                  {pipeline.map(
                    (stage, index) => (
                      <button
                        key={stage.key}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/opportunities?status=${stage.key}`
                          )
                        }
                        className="group relative rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-slate-200 hover:bg-white"
                      >

                        {index <
                          pipeline.length - 1 && (
                          <div className="absolute -right-2 top-[31px] z-10 hidden h-0.5 w-2 bg-slate-200 xl:block" />
                        )}

                        <div className="flex items-center justify-between gap-2">

                          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                            {stage.shortLabel}
                          </span>

                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-semibold text-slate-600 shadow-sm">
                            {stage.count}
                          </span>

                        </div>

                        <div className="mt-5">

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-slate-900 transition-all"
                              style={{
                                width:
                                  stats.total > 0
                                    ? `${Math.max(
                                        6,
                                        Math.min(
                                          100,
                                          (stage.count /
                                            stats.total) *
                                            100
                                        )
                                      )}%`
                                    : '6%',
                              }}
                            />
                          </div>

                          <p className="mt-3 text-[11px] font-medium leading-4 text-slate-500">
                            {stage.label}
                          </p>

                        </div>

                      </button>
                    )
                  )}

                </div>
              </div>
            </section>

            {search.trim() && (
              <section className="mb-8 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:p-6">

                <div className="flex items-center justify-between">
                  <SectionHeading
                    eyebrow="Search"
                    title="Matching opportunities"
                  />

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {filteredOpportunities.length}
                  </span>
                </div>

                <div className="mt-5 divide-y divide-slate-100">

                  {filteredOpportunities
                    .slice(0, 6)
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/opportunities/${item.id}`
                          )
                        }
                        className="flex w-full items-center gap-4 py-4 text-left transition hover:bg-slate-50"
                      >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <BriefcaseBusiness
                            size={16}
                          />
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-semibold text-slate-900">
                            {item.reference}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-500">
                            {CATEGORY_LABELS[
                              item.category
                            ]}{' '}
                            ·{' '}
                            {
                              STATUS_LABELS[
                                item.status
                              ]
                            }
                          </p>

                        </div>

                        <ArrowRight
                          size={16}
                          className="text-slate-300"
                        />

                      </button>
                    ))}

                  {filteredOpportunities.length ===
                    0 && (
                    <EmptyState
                      icon={
                        <Search size={19} />
                      }
                      title="No matching opportunities"
                      description="Try another reference, category or status."
                    />
                  )}

                </div>
              </section>
            )}

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

              <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
                  <SectionHeading
                    eyebrow="Priority Queue"
                    title="Needs intervention"
                  />

                  <AlertCircle
                    size={18}
                    className="text-red-500"
                  />
                </div>

                {priorityQueue.length === 0 ? (
                  <EmptyState
                    icon={
                      <CheckCircle2
                        size={19}
                      />
                    }
                    title="Queue is clear"
                    description="There are currently no priority items requiring your intervention."
                  />
                ) : (
                  <div className="divide-y divide-slate-100">

                    {priorityQueue.map(
                      (item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/opportunities/${item.id}`
                            )
                          }
                          className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 sm:px-6"
                        >

                          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 sm:flex">
                            <BriefcaseBusiness
                              size={17}
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <p className="truncate text-sm font-semibold text-slate-950">
                                {item.reference}
                              </p>

                              <span
                                className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${getPriorityClass(
                                  item.priority
                                )}`}
                              >
                                {item.priority}
                              </span>

                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">

                              <span className="text-xs text-slate-500">
                                {
                                  CATEGORY_LABELS[
                                    item.category
                                  ]
                                }
                              </span>

                              <span className="text-slate-300">
                                •
                              </span>

                              <span
                                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStatusClass(
                                  item.status
                                )}`}
                              >
                                {
                                  STATUS_LABELS[
                                    item.status
                                  ]
                                }
                              </span>

                              <span className="text-slate-300">
                                •
                              </span>

                              <span className="text-[11px] text-slate-400">
                                {formatRelativeTime(
                                  item.submitted_at
                                )}
                              </span>

                            </div>
                          </div>

                          <ArrowRight
                            size={17}
                            className="shrink-0 text-slate-300"
                          />

                        </button>
                      )
                    )}

                  </div>
                )}

                {priorityQueue.length > 0 && (
                  <div className="border-t border-slate-100 p-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          '/admin/opportunities?queue=priority'
                        )
                      }
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      View complete priority queue
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

              </div>

              <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

                  <SectionHeading
                    eyebrow="Recent Activity"
                    title="Latest events"
                  />

                  <Activity
                    size={18}
                    className="text-slate-500"
                  />

                </div>

                {auditLogs.length === 0 ? (
                  <EmptyState
                    icon={
                      <Clock3 size={19} />
                    }
                    title="No recent activity"
                    description="New administrative activity will appear here as the system is used."
                  />
                ) : (
                  <div className="divide-y divide-slate-100">

                    {auditLogs.map(
                      (log) => (
                        <button
                          type="button"
                          key={log.id}
                          onClick={() =>
                            log.target_type &&
                            log.target_id
                              ? navigate(
                                  `/admin/${log.target_type}/${log.target_id}`
                                )
                              : undefined
                          }
                          className="flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
                        >

                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <Activity
                              size={14}
                            />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-3">

                              <p className="text-xs font-semibold text-slate-900">
                                {getActionLabel(
                                  log.action
                                )}
                              </p>

                              <span className="shrink-0 text-[10px] text-slate-400">
                                {formatRelativeTime(
                                  log.created_at
                                )}
                              </span>

                            </div>

                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                              {log.target_type
                                ? `${log.target_type}${
                                    log.target_id
                                      ? ` · ${log.target_id.slice(
                                          0,
                                          8
                                        )}`
                                      : ''
                                  }`
                                : 'System activity'}
                            </p>

                          </div>

                        </button>
                      )
                    )}

                  </div>
                )}

              </div>
            </section>

            <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:p-6">

              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                <div className="flex items-start gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck
                      size={19}
                    />
                  </div>

                  <div>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      System
                    </p>

                    <h3 className="mt-1 text-sm font-semibold text-slate-950">
                      Secure workspace status
                    </h3>

                    <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
                      You are signed in to the private Barack
                      Mining Investment administration environment.
                    </p>

                  </div>

                </div>

                <div className="flex flex-wrap gap-2">

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Authentication
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Supabase
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Access control
                  </span>

                </div>

              </div>
            </section>

            <footer className="pb-6 pt-8 text-center text-[10px] uppercase tracking-[0.22em] text-slate-400">
              Barack Mining Investment · BMI Intelligence Hub
            </footer>

          </div>
        </main>
      </div>
    </div>
  )
}