import type { Access, CollectionConfig, Field, FieldAccess } from 'payload'

const isSuperAdmin = (user?: Record<string, any> | null) => user?.role === 'super-admin'

// Anyone logged in may touch their own document; super admins may touch all of them.
const superAdminOrSelf: Access = ({ req: { user } }) => {
    if (!user) return false
    if (isSuperAdmin(user)) return true
    return { id: { equals: user.id } }
}

const superAdminOnly: Access = ({ req: { user } }) => isSuperAdmin(user)

// Public create is allowed only while the users table is empty (the "create first user" screen).
const superAdminOrFirstUser: Access = async ({ req }) => {
    if (isSuperAdmin(req.user)) return true
    const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
    return totalDocs === 0
}

const superAdminFieldOnly: FieldAccess = ({ req: { user } }) => isSuperAdmin(user)

function getFullName(sd: Record<string, any>) {
    const fname = sd.fname || ''
    const mname = sd.mname || ''
    const lname = sd.lname || ''

    const parsedMname = mname ? (mname.charAt(0) + '.').toUpperCase() : ''
    return `${fname} ${parsedMname} ${lname}`.replace(/\s+/g, ' ').trim()
}

const metaDataFields: Field[] = [
    {
        name: 'fullName',
        type: 'text',
        virtual: true,
        admin: {
            readOnly: true,
            position: 'sidebar'
        },
        hooks: {
            afterRead: [
                ({ siblingData: sd }) => getFullName(sd) || sd.email || '',
            ],
        },
    },
    {
        name: 'lastLoggedIn',
        label: 'Last Logged In',
        type: 'date',
        admin: {
            readOnly: true,
            position: 'sidebar',
            date: {
                // displayFormat: 'yyyy-MM-dd HH:mm:ss',
                pickerAppearance: 'dayAndTime',
            }
        },

    },
]

export const Users: CollectionConfig = {
    slug: 'users',
    auth: true,
    admin: {
        useAsTitle: 'email',
        defaultColumns: ['email', 'role', 'createdAt', 'updatedAt'],
    },
    access: {
        create: superAdminOrFirstUser,
        read: superAdminOrSelf,
        update: superAdminOrSelf,
        delete: superAdminOnly,
    },
    fields: [
        {
            name: 'fname',
            label: 'First Name',
            type: 'text',
        },
        {
            name: 'mname',
            label: 'Middle Name',
            type: 'text',
        },
        {
            name: 'lname',
            label: 'Last Name',
            type: 'text',
        },
        {
            name: 'role',
            type: 'select',
            required: true,
            defaultValue: 'content-manager',
            // Stops users promoting themselves via their own (permitted) update.
            access: { update: superAdminFieldOnly },
            options: [
                { label: 'Super Admin', value: 'super-admin' },
                { label: 'Content Manager', value: 'content-manager' },
            ],
        },
        ...metaDataFields,
    ],
    hooks: {
        beforeValidate: [
            async ({ data, operation, req }) => {
                if (operation !== 'create') return data
                const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
                // The very first user must be able to administer everyone else.
                return totalDocs === 0 ? { ...data, role: 'super-admin' } : data
            },
        ],
        afterLogin: [
            async ({ user, req }) => {
                await req.payload.update({
                    collection: 'users',
                    id: user.id,
                    data: {
                        lastLoggedIn: new Date().toISOString(),
                    },
                    req,
                })
            },
        ],
    },
}
