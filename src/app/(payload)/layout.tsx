import type { ServerFunctionClient } from 'payload'
import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap'

const appName = process.env.APP_NAME || 'Echo'

type Args = {
    children: React.ReactNode
}

export const metadata = {
    title: 'Admin Dashboard',
    description: `${appName} admin dashboard`
}

const serverFunction: ServerFunctionClient = async function (args) {
    'use server'
    return handleServerFunctions({
        ...args,
        config,
        importMap
    })
}

const Layout = ({ children }: Args) => (
    <RootLayout
        config={config}
        importMap={importMap}
        serverFunction={serverFunction}
    >
        {children}
    </RootLayout>
)

export default Layout
