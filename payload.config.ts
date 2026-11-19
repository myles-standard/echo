import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './src/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const secret = process.env.PAYLOAD_SECRET
if (!secret) {
    throw new Error('PAYLOAD_SECRET environment variable is required')
}

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required')
}

export default buildConfig({
    editor: lexicalEditor(),
    collections: [
        Users,
    ],
    secret,
    db: postgresAdapter({
        pool: {
            connectionString: databaseUrl,
        },
    }),
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    admin: {
        user: Users.slug,
    },
})
