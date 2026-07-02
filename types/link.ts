
export interface Link {
  id: string
  user_id: string
  short_code: string
  
  // Content
  content: any // JSON object
  type: string
  
  // Display & Ordering
  title: string | null
  description: string | null
  position: number
  parent_id: string | null
  
  // Customization
  theme: any | null // JSON object
  is_custom: boolean
  is_public: boolean
  is_active: boolean
  
  // Scheduling
  start_date: string | null
  end_date: string | null
  
  // Analytics
  click_count: number
  view_count: number
  
  // Metadata
  meta: any | null // JSON object
  tags: string[] | null
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface LinkMeta {
  title: string | null
  image: string | null
}

export interface Tag {
  id: string
  selected?: boolean
}