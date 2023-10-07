/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites() {
        return {
            beforeFiles: [
                // if the host is `app.acme.com`,
                // this rewrite will be applied
                {
                    source: '/:path*',
                    has: [
                        {
                            type: 'host',
                            value: 'burbuja.rollan.com',
                        },
                    ],
                    destination: '/burbuja/:path*',
                },
            ]
        }
    }
}

module.exports = nextConfig
