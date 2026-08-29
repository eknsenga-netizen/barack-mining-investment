import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

// ============================================================
// CONFIGURATION (via .env.local)
// ============================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY
const CONTACT_EMAIL_RECIPIENT = process.env.CONTACT_EMAIL_RECIPIENT || 'Dg@barackminvest.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// ============================================================
// FONCTION PRINCIPALE
// ============================================================

export async function POST(request: Request) {
  try {
    // 1. Lire et valider les données
    const body = await request.json()
    const { name, email, message } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: 'Tous les champs sont requis.' },
        { status: 400 }
      )
    }

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Adresse email invalide.' },
        { status: 400 }
      )
    }

    if (message.length < 10) {
      return NextResponse.json(
        { message: 'Le message doit contenir au moins 10 caractères.' },
        { status: 400 }
      )
    }

    // 2. Initialiser Supabase (côté serveur)
    const supabase = await createClient()

    // 3. Insérer dans la table contact_messages
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        created_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('❌ Supabase insert error:', dbError)
      // On continue quand même pour tenter l’email
    }

    // 4. Envoyer un email de notification (si Resend est configuré)
    let emailSent = false
    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY)
        const { error: emailError } = await resend.emails.send({
          from: 'Barack Mining Investment <noreply@resend.dev>',
          to: [CONTACT_EMAIL_RECIPIENT],
          subject: `Nouveau message de ${name.trim()}`,
          text: `
            Nom : ${name.trim()}
            Email : ${email.trim()}
            Message :
            ${message.trim()}
          `,
          html: `
            <h2>Nouveau message du formulaire de contact</h2>
            <p><strong>Nom :</strong> ${name.trim()}</p>
            <p><strong>Email :</strong> ${email.trim()}</p>
            <p><strong>Message :</strong></p>
            <p>${message.trim()}</p>
            <hr />
            <p style="color:#888;font-size:12px;">Envoyé depuis ${SITE_URL}</p>
          `,
        })

        if (emailError) {
          console.error('❌ Resend email error:', emailError)
        } else {
          emailSent = true
        }
      } catch (emailErr) {
        console.error('❌ Email sending failed:', emailErr)
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY non configuré – email non envoyé.')
    }

    // 5. Réponse finale
    // On considère que la requête a réussi même si l’email échoue,
    // car le message est enregistré en base.
    return NextResponse.json(
      {
        success: true,
        message: 'Votre message a bien été envoyé.',
        emailSent,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('🔥 Contact API error:', error)
    return NextResponse.json(
      { message: 'Une erreur interne est survenue.' },
      { status: 500 }
    )
  }
}