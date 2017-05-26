import { Injectable, Inject } from '@angular/core';
import { URLSearchParams } from '@angular/http';
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

    getAll(skip?:number, take?:number): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/expenses`, (options) => {
            let params = new URLSearchParams();
            if (skip) {
                params.set("skip", skip.toString());
            }

            if (take) {
                params.set("take", take.toString());
            }
            options.search = params;
        });
    }

    getOne(item: IExpense): Observable<any> {
        return this.http.get(`${this.baseUrl}/api/expenses/` + item.id);
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
}
