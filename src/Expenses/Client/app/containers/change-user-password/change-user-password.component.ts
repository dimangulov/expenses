import { Component, EventEmitter, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router } from '@angular/router';
import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

import { UserService} from "../../shared/user.service";
import { AlertService} from "../../shared/alert.service";

@Component({
    templateUrl: './change-user-password.component.html'
})

export class ChangeUserPasswordComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;

    constructor(
        private location: Location,
        private userService: UserService,
        private alertService: AlertService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        console.log("ChangeUserPasswordComponent");
    }


    changePassword(password: string) {
        var id = this.route.snapshot.paramMap.get('id');

        this.userService.changePassword(Number(id), password)
            .subscribe(
            data => {
                this.location.back();
            },
            error => {
                console.log(error, error._body);
                this.alertService.error(error._body);
                this.loading = false;
            });
    }
}