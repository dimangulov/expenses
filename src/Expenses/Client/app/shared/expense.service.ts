import { Injectable, Inject } from '@angular/core';
import { URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { ORIGIN_URL } from './constants/baseurl.constants';
import { IExpense } from '../models/IExpense';
import { Observable } from 'rxjs/Observable';
import { HttpService } from "./http.service";

@Injectable()
export class ExpenseService {
    constructor(
        private http: HttpService, // Use for everything else
        @Inject(ORIGIN_URL) private baseUrl: string) {

    }

    getAll(requestBuilder?: (opt: RequestOptionsArgs) => void): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/expenses`, requestBuilder)
            .map(data => {
                for (let item of (<any>data).data) {
                    this.fixDates(item);
                }

                return data;
            });
    }

    getOne(id: any): Observable<any> {
        return this.http
            .get(`${this.baseUrl}/api/expenses/` + id)
            .map(item => this.fixDates(<any>item));
    }

    delete(item: IExpense): Observable<any> {
        return this.http.delete(`${this.baseUrl}/api/expenses/` + item.id);
    }

    update(item: IExpense): Observable<any> {
        return this.http.put(`${this.baseUrl}/api/expenses/` + item.id, item);
    }

    add(item: IExpense): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/expenses`, item);
    }

    fixDates(item: IExpense):IExpense {
        item.date = new Date(item.date);
        return item;
    }
}
