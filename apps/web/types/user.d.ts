interface User {
  id: number,
  full_name: string,
  email: string,
  phone_number: string,
  birth_date: Date,
  gender: "Laki-Laki" | "Perempuan",
  avatar: string,
  role: "Admin" | "Staff" | "Customer",
  status_account: "Active" | "Inactive" | "Pending",
  created_at: string,
  updated_at: string,
  deleted_at: string
}