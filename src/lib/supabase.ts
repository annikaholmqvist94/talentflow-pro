import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xlrbdnnferxnitillzmt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscmJkbm5mZXJ4bml0aWxsem10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDI4MTksImV4cCI6MjA4NTgxODgxOX0.45Ye2_w_uwnsdlD-Zu3enZcOLLfM01wWT5bO_fVKtv4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);