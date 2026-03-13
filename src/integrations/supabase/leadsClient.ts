import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myzzuvvrvdyxuztjktxv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15enp1dnZydmR5eHV6dGprdHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwOTY5OTIsImV4cCI6MjA4NzY3Mjk5Mn0.DjpvJzwyJSciyCxANl8HJKIUt1SBc-6xPLQSthA1wl0';

export const leadsSupabase = createClient(supabaseUrl, supabaseAnonKey);
