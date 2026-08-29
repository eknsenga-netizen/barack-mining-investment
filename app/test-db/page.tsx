import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()  // ← ajoute await
  const { data, error } = await supabase.from('profiles').select('*').limit(1)
  
  return (
    <pre>
      {error ? JSON.stringify(error, null, 2) : JSON.stringify(data, null, 2)}
    </pre>
  )
}