import { NextResponse, NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const savedState = req.cookies.get('spotify_auth_state')?.value

    if (searchParams.get('error') || !code || state !== savedState) {
        return NextResponse.redirect(new URL('/admin?spotify=error', req.url))
    }
}
