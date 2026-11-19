import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: {
        position: 'bottom-right',
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/admin',
                permanent: false
            }
        ]
    }
}

export default withPayload(nextConfig)
