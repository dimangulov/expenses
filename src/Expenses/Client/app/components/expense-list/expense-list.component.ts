import { Component, OnInit } from '@angular/core';
import { ExpenseService } from "../../shared/expense.service";
import { FilterHelper } from "../../shared/filter.helper";
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';

@Component({
    selector: 'expense-list',
    templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
    items: GridDataResult;

    state: State = {
        skip: 0,
        take: 25,
        filter: null,
        sort: [
            {
                dir: "desc",
                field: "date"
            }]
    };

    // Use "constructor"s only for dependency injection
    constructor(private expenseService: ExpenseService, private filterHelper: FilterHelper, private router: Router) { }

    // Here you want to handle anything with @Input()'s @Output()'s
    // Data retrieval / etc - this is when the Component is "ready" and wired up
    ngOnInit() {
        this.loadItems();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        console.log(state);
        this.loadItems();
    }
     
    loadItems() {
        this.expenseService.getAll((options) => this.filterHelper.buildRequest(options, this.state))
            .subscribe(result => {
                console.log('Get result: ', result);
                this.items = result;
            });
    }

    editHandler({dataItem}) {
        console.log(dataItem);
        this.router.navigate(["expenses", dataItem.id, "edit"]);
    }

    removeHandler({ dataItem }) {
        console.log(dataItem);
        this.expenseService.delete(dataItem)
            .subscribe(
            () => {
                console.log("done");
                    this.loadItems();
                },
                () => {
                    //TODO
                }
            );
    }
}
