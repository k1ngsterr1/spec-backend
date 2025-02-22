export class CreateTaskDto {
  cityId: number;
  cityArea?: string;
  categoryId: number;
  executeAt?: string; // Будем конвертировать в Date
  description?: string;
  priceMin: number;
  priceMax: number;
  commission: number;
  phone: string;
  address: string;
  statusId: number;
  creatorUserId: number;
  performerUserId?: number;
  emergencyCall?: boolean;
}
