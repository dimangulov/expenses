import { Injectable, Inject } from '@angular/core';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { IUser } from '../models/IUser';
import { Observable } from 'rxjs/Observable';
import { HttpService } from "./http.service";

@Injectable()
export class UserService {
    constructor(
        private http: HttpService, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getUsers(): Observable<any> {
        // ** TransferHttp example / concept **
        //    - Here we make an Http call on the server, save the result on the window object and pass it down with the SSR,
        //      The Client then re-uses this Http result instead of hitting the server again!

        //  NOTE : transferHttp also automatically does .map(res => res.json()) for you, so no need for these calls
        return this.http.get(`${this.baseUrl}/api/users`);
    }

    getUser(user: IUser): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/users/` + user.id);
    }

    deleteUser(user: IUser): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/users/` + user.id);
    }

    updateUser(user: IUser): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/users/` + user.id, user);
    }

    addUser(newUser: IUser): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/users`, newUser);
    }
}
