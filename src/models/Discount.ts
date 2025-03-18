export interface Discount {
  code: string;
  amount: number;
  type: 'PERCENTAGE' | 'FLAT';
}
