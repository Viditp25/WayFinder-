import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const getUrl = () => {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        return url && url.startsWith('http') ? url : 'https://placeholder.supabase.co';
    };

    const supabaseUrl = getUrl();
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    )
}
