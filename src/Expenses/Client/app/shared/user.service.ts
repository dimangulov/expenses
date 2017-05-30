import { Injectable, Inject } from '@angular/core';
import { URLSearchParams, RequestOptionsArgs } from '@angular/http';
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

    getAll(requestBuilder?: (opt: RequestOptionsArgs) => void): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/users`, requestBuilder);
    }

    getOne(id: any): Observable<any> {
        return this.http
            .get(`${this.baseUrl}/api/users/` + id);
    }

    delete(item: IUser): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/users/` + item.id);
    }

    update(item: IUser): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/users/` + item.id, item);
    }

    add(item: IUser): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/users`, item);
    }

    changePassword(id:number, password:string): Observable<any> {
        return this.http.postVoid(`${this.baseUrl}/api/users/${id}/password`, {password});
    }
}
