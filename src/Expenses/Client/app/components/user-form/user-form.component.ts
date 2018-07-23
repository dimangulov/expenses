import { Component, OnInit, Inject } from '@angular/core';
import { IUser, Roles } from "../../models/IUser";
import { UserService } from "../../shared/user.service";

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { AlertService } from '../../shared/alert.service';

@Component({
    selector: 'user-form',
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
    model: IUser = {};
    loading = false;


    isAdministrator: boolean = false;
    isManager: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private location:Location) { }

    ngOnInit() {
        let data: IUser = <IUser>this.route.snapshot.data['user'];

        if (data) {
            //data.date = <any>JSON.stringify(data.date);
            console.log(data);
            this.model = data;
            this.setRoles();
        }
    }
     
    save() {
        this.model.roles = this.getRoles();

        let method = this.model.id
            ? this.userService.update(this.model)
            : this.userService.add(this.model);

        return method.subscribe(
            data => {
                this.location.back();;
            },
            error => {
                console.log(error._body);
                this.alertService.error(error._body);
            });
    }

    setRoles() {
        this.isAdministrator = this.model.roles.filter(r => r == Roles.Administrator).length > 0;
        this.isManager = this.model.roles.filter(r => r == Roles.Manager).length > 0;
    }
     
    getRoles() {
        let roles = [];

        if (this.isAdministrator) {
            roles.push(Roles.Administrator);
        }

        if (this.isManager) {
            roles.push(Roles.Manager);
        }

        return roles;
    }
}
