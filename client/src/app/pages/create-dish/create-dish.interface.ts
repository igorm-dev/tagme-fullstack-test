export interface CreateDishForm {
  title: string;
  description: string;
  category: string;
  price: number;
  isAvailable: boolean;
  image: Blob;
}
