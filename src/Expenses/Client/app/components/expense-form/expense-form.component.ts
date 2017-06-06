import { Component, OnInit, Inject } from '@angular/core';
import {IExpense} from "../../models/IExpense";
import { ExpenseService } from "../../shared/expense.service";

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { AlertService } from '../../shared/alert.service';

@Component({
    selector: 'expense-form',
    templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent implements OnInit {
    model: IExpense = {
        amount: 0,
        date: new Date()
    };
    loading = false;
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private expenseService: ExpenseService,
        private alertService: AlertService,
        private location:Location) { }

    ngOnInit() {
        let data:IExpense = this.route.snapshot.data['expense'];

        if (data) {
            //data.date = <any>JSON.stringify(data.date);
            console.log(data);
            this.model = data;
        }
    }

    save() {
        let method = this.model.id
            ? this.expenseService.update(this.model)
            : this.expenseService.add(this.model);

        return method.subscribe(
            data => {
                this.location.back();
            },
            error => {
                console.log(error, error.json());
                this.alertService.error(error._body);
            });
    }
}
