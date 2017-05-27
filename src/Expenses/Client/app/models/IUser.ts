export interface IUser {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    roles?:string[];
}
 
export class Roles {
    static Administrator = "Administrator";
    static Manager = "Manager";
}