/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
        REACT_APP_SUPABASE_KEY: process.env.REACT_APP_SUPABASE_KEY,
        CLICKUP_API_KEY: process.env.CLICKUP_API_KEY,
        CLICKUP_CLIENT_ID: process.env.CLICKUP_CLIENT_ID,
    }
};

export default nextConfig;
