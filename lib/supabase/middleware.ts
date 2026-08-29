import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          supabaseResponse = NextResponse.next({
            request,
          })

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  /*
   * Ne pas exécuter de code entre createServerClient()
   * et supabase.auth.getUser().
   */
  const {
    data: { user },
  } = await supabase.auth.getUser()

  /*
   * Protection des routes administratives.
   *
   * Si aucun utilisateur authentifié tente d'accéder
   * à /admin ou à une sous-route de /admin,
   * redirection vers /login.
   */
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    const url = request.nextUrl.clone()

    url.pathname = '/login'
    url.search = ''

    return NextResponse.redirect(url)
  }

  /*
   * Transmettre le pathname au RootLayout.
   *
   * Le RootLayout peut ainsi déterminer si la page
   * actuelle est publique ou réservée au dashboard/login.
   */
  supabaseResponse.headers.set(
    'x-pathname',
    request.nextUrl.pathname
  )

  return supabaseResponse
}
