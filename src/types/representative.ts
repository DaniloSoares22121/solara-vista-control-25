
export interface Representative {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  commission_rate: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface RepresentativeFormData {
  name: string;
  email: string;
  phone: string;
  region: string;
  commission_rate: number;
  status: 'active' | 'inactive';
}
