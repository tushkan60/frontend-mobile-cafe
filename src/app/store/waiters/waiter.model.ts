export class Waiter {
  constructor(
    public _id: string | null,
    public name: string | null,
    public efficiency: number | null,
    public isAvailable: boolean | null,
    public inShift: boolean | null,
    public shifts: string[] | null,
    public openOrders: number | null,
  ) {}
}
