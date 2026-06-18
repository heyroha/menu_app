import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pprtctcsfopvjeugjldp.supabase.co'
const SUPABASE_KEY = 'sb_publishable_xJs4nzSej_-BC6Jovs1fPw_mYns6cyE'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
