export interface Icard {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  isshowed?: boolean;
  rating : number;
  stock: number;
  images?: string[];
}
