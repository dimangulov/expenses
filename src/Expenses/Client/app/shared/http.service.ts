import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { AuthService } from "../security/auth.service";
import { Observable } from 'rxjs/Observable';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpService {
    constructor(
        private http: Http,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router) { }

    public get(url: string, requestBuilder?: (opt: RequestOptionsArgs) => void): Observable<Response> {
        var options = this.getHttpOptions();

        if (requestBuilder) {
            requestBuilder(options);
            console.log(options);
        }

        return this.http.get(url, options)
            .map(r => r.json())
            .catch(r => this.handleResponse(r))
            ;
    }

    public post(url: string, body: any): Observable<Response> {
        var options = this.getHttpOptions();
        return this.http.post(url, body, options)
            .map(r => r.json())
            .catch(r => this.handleResponse(r))
            ;
    }

    public postVoid(url: string, body: any): Observable<Response> {
        var options = this.getHttpOptions();
        return this.http.post(url, body, options)
                .catch(r => this.handleResponse(r))
            ;
    }

    public put(url: string, body:any): Observable<Response> {
        var options = this.getHttpOptions();
        return this.http.put(url, body, options)
            .map(r => r.json())
            .catch(r => this.handleResponse(r)) 
            ;
    }

    public delete(url: string): Observable<Response> {
        var options = this.getHttpOptions();
        return this.http.delete(url, options)
            .catch(r => this.handleResponse(r))
            ;
    }

    private handleResponse(res) {
        //debugger;
        //console.log(res);
        // If request fails, throw an Error that will be caught
        if (res.status == 401) {
            this.authService.logout();
            this.alertService.error("Session expired");
            this.router.navigate(["/login"]);
            return Observable.throw(res);;
        }

        return Observable.throw(res);
    }

    private getHttpOptions(): RequestOptionsArgs {
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + this.authService.token);

        return {
            headers
        };
    }
}