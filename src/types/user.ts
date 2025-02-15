export interface AddressTypes {
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
  createdAt: Date;
  addresses?: AddressTypes[];
}
