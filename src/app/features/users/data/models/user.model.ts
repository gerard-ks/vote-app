export interface UserModel{
  user_id: string;
  full_name: string;
  email_address: string;
  role_type: string;
  is_email_verified: boolean;
  is_active_account: boolean;
  created_at_timestamp: string;
}

export interface PaginatedUsersModel {
  content: UserModel[];
  total_elements: number;
  current_page_number: number;
  page_size: number;
}
