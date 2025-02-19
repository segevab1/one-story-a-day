
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dbyswnjzkhxzgslpqlfk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRieXN3bmp6a2h4emdzbHBxbGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwNjg5NDEsImV4cCI6MjA1MTY0NDk0MX0.GkCKMH_AkHXJUNzmLJrU0bjmaGA6orHv9S7P1Dt33zo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
