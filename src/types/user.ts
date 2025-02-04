export type User = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSeller: boolean;
  createdAt: Date;
};

export type AddressTypes = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
