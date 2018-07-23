import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { IUser } from "../models/IUser";
import { IUserWithToken } from "../models/IUserWithToken";

@Injectable()
export class AuthService {
    token: string = null;
    user: IUser = <IUser>null;

    userLoggedIn: EventEmitter<IUser> = new EventEmitter();
    userLoggedOut: EventEmitter<any> = new EventEmitter();

    private storageKey = "userInfo";

    constructor(private http: Http) {}

    login(username: string, password: string) {
        return this.http.post("/api/Login/Authenticate", { Username: username, Password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const responseJson = response.json();
                this.loginInternal(responseJson);
            });
    }

    register(user:IUser) {
        return this.http.post("/api/Login/Register", user);
    }

    changePassword(password: string) {
        return this.http.post("/api/Login/Password", {password}, this.getHttpOptions());
    }

    tryGetInfoFromStore(): boolean {
        var data = sessionStorage.getItem(this.storageKey);

        if (data === null) {
            return false;
        }

        this.loginInternal(JSON.parse(data));
        return true;
    }

    private loginInternal(data: IUserWithToken) {
        this.token = data.token;
        this.user = data.user;

        sessionStorage.setItem(this.storageKey, JSON.stringify(data));

        this.userLoggedIn.emit(this.user);
    }

    logout() {
        // remove user from local storage to log user out
        this.token = null;
        this.user = <IUser>null;

        sessionStorage.removeItem(this.storageKey);
    
        this.userLoggedOut.emit(null);
    }

    isLoggedIn() {
        return this.token != null;
    }

    private getHttpOptions(): RequestOptionsArgs {
        var headers = new Headers();
        headers.append("Authorization", "Bearer " + this.token);

        return {
            headers
        };
    }
}