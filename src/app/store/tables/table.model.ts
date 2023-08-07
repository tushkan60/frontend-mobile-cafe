export class Table {
  constructor(
    public _id: string | null,
    public number: number | null,
    public defaultWaiter: string | null,
    public isOccupied: boolean | null,
  ) {}
}
