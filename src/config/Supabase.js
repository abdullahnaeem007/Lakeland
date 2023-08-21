import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('Your supabase url', 'your supabase key')

export default supabase