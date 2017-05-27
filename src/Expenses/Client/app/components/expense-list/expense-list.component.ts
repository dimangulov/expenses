import { Component, OnInit, Inject } from '@angular/core';
import {IExpense} from "../../models/IExpense";
import { ExpenseService } from "../../shared/expense.service";
import { FilterHelper } from "../../shared/filter.helper";
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State } from '@progress/kendo-data-query';
import { URLSearchParams, RequestOptionsArgs } from '@angular/http';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'expense-list',
    templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
    items: GridDataResult;

    private state: State = {
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
        this.expenseService.getAll((options) => this.buildRequest(options))
            .subscribe(result => {
                console.log('Get result: ', result);
                this.items = result;
            });
    }

    buildRequest(options) {
        var commands = [];

        if (this.state.skip) {
            commands.push("skip="+this.state.skip);
        }

        if (this.state.take) {
            commands.push("take=" + this.state.take);
        }

        if (this.state.filter) {
            var filterParams = this.filterHelper.Build(this.state.filter);
            console.log(filterParams);

            commands = [...commands, ...filterParams];
        }

        if (this.state.sort && this.state.sort.length > 0) {
            let sort = this.state.sort[0];
            var dir = sort.dir == "asc" ? "orderby" : "orderbydesc";
            commands.push(dir + "=" + sort.field);
        }

        console.log(commands);
        var commandsText = commands.reduce((prev, curr) => prev + "&" + curr);
        console.log(commandsText);

        var params = new URLSearchParams();
        params.set("commands", commandsText);

        options.search = params;
    }

    editHandler({dataItem}) {
        console.log(dataItem);
        this.router.navigate(["expenses", "edit", dataItem.id]);
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
