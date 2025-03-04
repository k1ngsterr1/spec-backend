export class CreateTaskDto {
  city_id: number;
  city_area?: string; // ✅ Matches "city_area"
  title: string;
  category_id: number; // ✅ Matches "category_id"
  execute_at?: string; // ✅ Matches "execute_at", to be converted to Date
  description?: string;
  comment?: string;
  price_min: number; // ✅ Matches "price_min"
  price_max: number; // ✅ Matches "price_max"
  commission: number;
  phone: string;
  address: string;
  status_id: number; // ✅ Matches "status_id"
  creator_user_id: number; // ✅ Matches "creator_user_id"
  performer_user_id?: number; // ✅ Matches "performer_user_id"
  emergency_call?: boolean; // ✅ Matches "emergency_call"
}
