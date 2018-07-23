import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService} from "../../security/auth.service";
import { AlertService} from "../../shared/alert.service";
import {IUser} from "../../models/IUser";

@Component({
    templateUrl: './register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private authService: AuthService,
        private alertService: AlertService) { }

    register() {
        this.loading = true;
        this.authService.register(<IUser>this.model)
            .subscribe(
                data => {
                    // set success message and pass true paramater to persist the message after redirecting to the login page
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}