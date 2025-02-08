
export interface Story {
  id: string;
  name: string;
  age: number;
  date: string;
  unit: string;
  story: string;
  image: string;
  candlesLit: number;
  contact: {
    email: string;
    phone: string;
  };
}
