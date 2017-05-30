import { Component, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';

import { AuthService} from "../../security/auth.service";
import { AlertService} from "../../shared/alert.service";

@Component({
    templateUrl: './change-my-password.component.html'
})

export class ChangeMyPasswordComponent {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private location: Location,
        private authService: AuthService,
        private alertService: AlertService) { }

    changePassword(password: string) {
        this.authService.changePassword(password)
            .subscribe(
            data => {
                this.location.back();
            },
            error => {
                console.log(error._body);
                this.alertService.error(error._body);
                this.loading = false;
            });
    }
}