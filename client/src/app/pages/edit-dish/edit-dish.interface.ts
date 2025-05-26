export interface EditDishForm {
  title: string;
  description: string;
  category: string;
  price: number;
  isAvailable: boolean;
  image: Blob;
}
