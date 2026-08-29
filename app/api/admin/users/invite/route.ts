import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

type Role =
  | 'super_admin'
  | 'admin'
  | 'opportunity_manager'
  | 'content_manager'
  | 'operations_manager'
  | 'viewer'

const AUTHORIZED_ROLES: Role[] = [
  'super_admin',
  'admin',
]

const VALID_ROLES: Role[] = [
  'super_admin',
  'admin',
  'opportunity_manager',
  'content_manager',
  'operations_manager',
  'viewer',
]

function isValidEmail(
  value: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  )
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json()

    const email =
      typeof body.email === 'string'
        ? body.email
            .trim()
            .toLowerCase()
        : ''

    const fullName =
      typeof body.full_name === 'string'
        ? body.full_name.trim()
        : ''

    const role =
      typeof body.role === 'string'
        ? body.role as Role
        : null

    if (
      !email ||
      !isValidEmail(email)
    ) {
      return NextResponse.json(
        {
          message:
            'A valid email address is required.',
        },
        {
          status: 400,
        }
      )
    }

    if (
      email.length >
      254
    ) {
      return NextResponse.json(
        {
          message:
            'The email address is too long.',
        },
        {
          status: 400,
        }
      )
    }

    if (
      fullName.length >
      120
    ) {
      return NextResponse.json(
        {
          message:
            'The full name is too long.',
        },
        {
          status: 400,
        }
      )
    }

    if (
      !role ||
      !VALID_ROLES.includes(
        role
      )
    ) {
      return NextResponse.json(
        {
          message:
            'Invalid user role.',
        },
        {
          status: 400,
        }
      )
    }

    /* ========================================================
       USER SESSION
    ======================================================== */

    const cookieStore =
      await cookies()

    const supabase =
      createServerClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,
        process.env
          .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(
              cookiesToSet
            ) {
              try {
                cookiesToSet.forEach(
                  ({
                    name,
                    value,
                    options,
                  }) => {
                    cookieStore.set(
                      name,
                      value,
                      options
                    )
                  }
                )
              } catch {
                // Ignore cookie writes when
                // invoked from a read-only context.
              }
            },
          },
        }
      )

    const {
      data: {
        user,
      },
    } =
      await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          message:
            'Authentication required.',
        },
        {
          status: 401,
        }
      )
    }

    /* ========================================================
       ACTOR AUTHORIZATION
    ======================================================== */

    const {
      data: actorProfile,
      error: actorError,
    } =
      await supabase
        .from('profiles')
        .select(
          'id, email, role'
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
      return NextResponse.json(
        {
          message:
            'You are not authorized to invite users.',
        },
        {
          status: 403,
        }
      )
    }

    /* ========================================================
       SERVICE ROLE — SERVER ONLY
    ======================================================== */

    const serviceRoleKey =
      process.env
        .SUPABASE_SERVICE_ROLE_KEY

    if (
      !serviceRoleKey
    ) {
      console.error(
        'SUPABASE_SERVICE_ROLE_KEY is not configured.'
      )

      return NextResponse.json(
        {
          message:
            'Server user-management configuration is incomplete.',
        },
        {
          status: 500,
        }
      )
    }

    const admin =
      createSupabaseAdminClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken:
              false,
            persistSession:
              false,
          },
        }
      )

    /* ========================================================
       DUPLICATE CHECK
    ======================================================== */

    const {
      data: existingProfiles,
      error:
        existingProfileError,
    } =
      await supabase
        .from('profiles')
        .select(
          'id'
        )
        .eq(
          'email',
          email
        )
        .limit(1)

    if (
      existingProfileError
    ) {
      console.error(
        'Existing profile check failed:',
        existingProfileError
      )

      return NextResponse.json(
        {
          message:
            'Unable to verify whether this user already exists.',
        },
        {
          status: 500,
        }
      )
    }

    if (
      existingProfiles &&
      existingProfiles.length >
        0
    ) {
      return NextResponse.json(
        {
          message:
            'This email is already registered.',
        },
        {
          status: 409,
        }
      )
    }

    /* ========================================================
       AUTH INVITATION
    ======================================================== */

    const {
      data: inviteData,
      error: inviteError,
    } =
      await admin.auth.admin.inviteUserByEmail(
        email,
        {
          data: {
            full_name:
              fullName ||
              null,
            role,
          },
        }
      )

    if (
      inviteError ||
      !inviteData.user
    ) {
      console.error(
        'Supabase invitation failed:',
        inviteError
      )

      return NextResponse.json(
        {
          message:
            inviteError?.message ||
            'Unable to send invitation.',
        },
        {
          status: 400,
        }
      )
    }

    /* ========================================================
       PROFILE
       Trigger may already create it.
       We update/upsert the intended role safely.
    ======================================================== */

    const {
      error:
        profileError,
    } =
      await supabase
        .from('profiles')
        .upsert(
          {
            id:
              inviteData.user.id,
            email,
            full_name:
              fullName ||
              null,
            role,
          },
          {
            onConflict:
              'id',
          }
        )

    if (
      profileError
    ) {
      console.error(
        'Profile upsert failed after invitation:',
        profileError
      )

      /*
        The Auth invitation was already created.
        Do not report the whole process as if
        the invitation itself failed.
      */
    }

    return NextResponse.json(
      {
        success:
          true,
        user_id:
          inviteData.user.id,
      },
      {
        status: 200,
      }
    )
  } catch (
    error
  ) {
    console.error(
      'Admin invite route failed:',
      error
    )

    return NextResponse.json(
      {
        message:
          error instanceof
          Error
            ? error.message
            : 'Unable to process invitation.',
      },
      {
        status: 500,
      }
    )
  }
}