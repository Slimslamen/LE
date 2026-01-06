import { NextResponse } from 'next/server'
import { supabaseServerClient } from '@/lib/db/server'
import { isAdminUser } from '@/lib/auth/isAdmin'

export async function GET() {
	const supabase = await supabaseServerClient()

	const { data, error } = await supabase.auth.getUser()
	if (error) return NextResponse.json({ error: error.message }, { status: 401 })

	const user = data.user
	if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

	const ok = await isAdminUser(supabase, user)
	if (!ok) {
		if (process.env.NODE_ENV !== 'production') {
			return NextResponse.json(
				{
					error: 'Forbidden',
					uid: user.id,
					adminCheck: {
						strategy: 'profiles.role',
						email: user.email ?? null,
					},
				},
				{ status: 403 }
			)
		}
		return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	}

	return NextResponse.json({ user })
}