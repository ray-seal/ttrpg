import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iakxrzjfrbqekvywlnep.supabase.co'
const supabaseKey = 'sb_publishable_yMUt80L1bEC7BPWDjv3cmg_jOZeL87_'

export const supabase = createClient(supabaseUrl, supabaseKey)