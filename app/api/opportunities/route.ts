import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Génération d’un numéro de référence unique
    const ref = `BMI-${Date.now().toString(36).toUpperCase()}`

    const supabase = await createClient()

    // Insertion dans la table opportunities
    const { error } = await supabase.from('opportunities').insert({
      reference: ref,
      category: body.profile,
      metadata: body,
      submitted_at: new Date().toISOString(),
      source: 'website',
      status: 'new',
      priority: 'standard',
    })

    if (error) {
      console.error('Opportunity insert error:', error)
      return NextResponse.json({ message: 'Erreur d’enregistrement' }, { status: 500 })
    }

    // Optionnel : notification email à l’admin
    // await sendNotificationEmail(body)

    return NextResponse.json({ success: true, reference: ref })
  } catch (error) {
    console.error('Opportunity API error:', error)
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}