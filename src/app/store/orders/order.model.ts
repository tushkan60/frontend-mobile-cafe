export class Order {
  constructor(
    public _id: string | null,
    public waiterId: string | null,
    public table: string | null,
    public dishes: {
      dish: string | null;
      quantity: number | null;
      _id: string | null;
    }[],
    public totalAmount: number | null,
    public tipsAmount: number | null,
    public isPaid: boolean | null,
    public createdAt: Date | null,
    public closedAt: Date | null,
  ) {}
}
