import { createClient } from "@supabase/supabase-js";

// Polyfill WebSocket for Node SSR environments if missing
if (typeof window === "undefined" && typeof globalThis.WebSocket === "undefined") {
  class DummyWebSocket {
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  }
  (globalThis as any).WebSocket = DummyWebSocket;
}

// Read Supabase environment variables safely
const supabaseUrl =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ||
  "https://qvwmoegqwfpcyzgnzcio.supabase.co";
const supabaseAnonKey =
  (import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined) || "your-anon-key";

// Check if credentials are properly configured
export const isSupabaseConfigured = Boolean(
  import.meta.env["VITE_SUPABASE_URL"] && import.meta.env["VITE_SUPABASE_ANON_KEY"],
);

// Create Supabase Client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
  },
});
