export class Statistics {
  constructor(
    public dayTotalOrders: number | null,
    public dayTotalRevenue: number | null,
    public dayTotalTips: number | null,
    public waiters:
      | {
          _id: string | null;
          totalOrders: number | null;
          totalRevenue: number | null;
          totalTips: number | null;
          efficiency: string | null;
          dayWaiterTips: number | null;
        }[]
      | null,

    public top5Dishes:
      | {
          dish: string | null;
          quantity: number | null;
        }[]
      | null,
  ) {}
}
