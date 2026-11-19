import { NextResponse, NextRequest } from 'next/server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
    const state = crypto.randomBytes(16).toString('hex')

    const clientId = process.env.SPOTIFY_CLIENT_ID
    const redirectUrl = process.env.SPOTIFY_REDIRECT_URI
    const scope = 'user-read-private user-read-email'

    const spotifyUrl = new URL('https://accounts.spotify.com/authorize')
    spotifyUrl.searchParams.set('client_id', clientId!)
    spotifyUrl.searchParams.set('response_type', 'code')
    spotifyUrl.searchParams.set('redirect_uri', redirectUrl)
    spotifyUrl.searchParams.set('state', state)
    spotifyUrl.searchParams.set('scope', scope)

    const res = NextResponse.redirect(spotifyUrl)

    res.cookies.set({
        name: 'spotify_auth_state',
        value: state,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 600, // 10 minutes
    })

    return res
}
