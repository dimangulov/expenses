import { Component, OnInit, Inject } from '@angular/core';
import {IExpense} from "../../models/IExpense";
import { ExpenseService } from "../../shared/expense.service";
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
    selector: 'expense-list',
    templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
    items: GridDataResult;
    total: number;
    take: number = 10;
    skip: number = 0;

    // Use "constructor"s only for dependency injection
    constructor(private expenseService:ExpenseService) { }

    // Here you want to handle anything with @Input()'s @Output()'s
    // Data retrieval / etc - this is when the Component is "ready" and wired up
    ngOnInit() {
        this.loadItems();
    }

    pageChange({ skip, take }:PageChangeEvent) {
        this.skip = skip;
        this.take = take;
        this.loadItems();
    }

    loadItems() {
        this.expenseService.getAll(this.skip, this.take).subscribe(result => {
            console.log('Get user result: ', result);
            this.items = result;
        });
    }
}
