export interface IExpense {
    id?: number;
    userId?: number;
    username?: string;
    date: Date;
    description?: string;
    amount: number;
    comment?:string;
}