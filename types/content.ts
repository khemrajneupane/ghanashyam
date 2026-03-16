export interface Content {
  _id: string;
  title?: string;
  description: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}
