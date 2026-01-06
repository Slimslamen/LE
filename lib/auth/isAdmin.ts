import type { SupabaseClient, User } from '@supabase/supabase-js'

export async function isAdminUser(supabase: SupabaseClient, user: User | null): Promise<boolean> {
  if (!user) return false

  // Strict: user must have a profile row with role = 'admin'
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle<{ role: string | null }>()

    if (error) return false
    return (data?.role ?? '').toLowerCase() === 'admin'
  } catch {
    return false
  }
}
