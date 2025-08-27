export type UUID = string;
export interface Branch {
  id: UUID;
  branchId: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  city: string;
  country: string;
  // ... other branch properties
}