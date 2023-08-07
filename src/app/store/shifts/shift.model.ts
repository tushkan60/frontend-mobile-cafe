export class Shift {
  constructor(
    public _id: string | null,
    public waiterId: string | null,
    public startTime: Date | null,
    public isOpen: boolean | null,
    public totalOrders: number | null,
    public totalRevenue: number | null,
    public totalTips: number | null,
    public endTime: Date | null,
    public orders: string[] | null,
  ) {}
}
