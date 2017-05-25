import { Component, OnInit } from '@angular/core';
import { AlertService } from "../../shared/alert.service";

@Component({
    selector: 'alert-component',
    templateUrl: './alert.component.html'
})
export class AlertComponent {
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }
}