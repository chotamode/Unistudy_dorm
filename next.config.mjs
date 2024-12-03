/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
        REACT_APP_SUPABASE_KEY: process.env.REACT_APP_SUPABASE_KEY,
        CLICKUP_API_KEY: process.env.CLICKUP_API_KEY,
        CLICKUP_CLIENT_ID: process.env.CLICKUP_CLIENT_ID,

        MAKE_WEBHOOK_NEW: process.env.MAKE_WEBHOOK_NEW,
        MAKE_WEBHOOK_REJECTED: process.env.MAKE_WEBHOOK_REJECTED,
        MAKE_WEBHOOK_APPROVED: process.env.MAKE_WEBHOOK_APPROVED
    }
};

export default nextConfig;
