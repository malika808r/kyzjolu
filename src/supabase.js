import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gtphpmcuuusdnsrvxqid.supabase.co'
const supabaseKey = 'sb_publishable_3kOJhBWXXeezRs9PL8XJfg_lw8c_KCG'

export const supabase = createClient(supabaseUrl, supabaseKey)