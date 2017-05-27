import { Component, OnInit, Inject } from '@angular/core';
import {IExpense} from "../../models/IExpense";
import { ExpenseService } from "../../shared/expense.service";
import { FilterHelper } from "../../shared/filter.helper";
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, State, GroupDescriptor, aggregateBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'expense-report',
    templateUrl: './expense-report.component.html'
})
export class ExpenseReportComponent implements OnInit {
    items: GridDataResult;
    total:number = 0;
    averagePerDay:number = 0;
    private aggregates: any[] = [{ field: 'amount', aggregate: 'sum' }];

    fromDate:Date;
    toDate:Date;

    state: State = {
        skip: 0,
        take: 1000,
        filter: null,
        sort: [
            {
                dir: "desc",
                field: "date"
            }],
        group: [{ field: "date_Day", aggregates: this.aggregates }]
    };

    // Use "constructor"s only for dependency injection
    constructor(private expenseService: ExpenseService, private filterHelper: FilterHelper, private router: Router) { }

    // Here you want to handle anything with @Input()'s @Output()'s
    // Data retrieval / etc - this is when the Component is "ready" and wired up
    ngOnInit() {
        this.initWeek();
        this.loadItems();
    }

    initWeek() {
        var fromDate = this.findPrevMonday(new Date());
        var toDate = this.findNextSunday(new Date());

        this.applyFilters(fromDate, toDate);
    }

    applyFilters(fromDate: Date, toDate: Date) {
        this.fromDate = this.getDateWithoutTime(fromDate);
        this.toDate = this.makeDateWith2359(toDate);

        this.state.filter = {
            logic: "and",
            filters: [
                {
                    field: "date",
                    operator: "gte",
                    value: this.fromDate
                },
                {
                    field: "date",
                    operator: "lte",
                    value: this.toDate
                }
            ]
        }
    }

    getDateWithoutTime(date: Date):Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    makeDateWith2359(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    }

    findPrevMonday(date: Date) {
        var date = new Date(date.getTime());

        let mondayNumberInJs = 1;
        while (date.getDay() != mondayNumberInJs) {
            date = this.substractOneDay(date);
        }
        return date;
    }

    findNextSunday(date: Date) {
        var date = new Date(date.getTime());

        let sundayNumberInJs = 0;
        while (date.getDay() != sundayNumberInJs) {
            date = this.addOneDay(date);
        }
        return date;
    }

    substractOneDay(date: Date): Date {
        var date = new Date(date.getTime());
        date.setDate(date.getDate() - 1);
        return date;
    }

    addOneDay(date: Date): Date {
        var date = new Date(date.getTime());
        date.setDate(date.getDate() + 1);
        return date;
    }

    goToPrevWeek() {
        var toDate = this.substractOneDay(this.fromDate);
        var fromDate = this.findPrevMonday(toDate);

        this.applyFilters(fromDate, toDate);
        this.loadItems();
    }

    datesEqual(d1: Date, d2: Date) {
        return this.getDateWithoutTime(d1) === this.getDateWithoutTime(d2);
    }

    goToNextWeek() {
        var fromDate = this.addOneDay(this.toDate);
        var toDate = this.findNextSunday(fromDate);

        this.applyFilters(fromDate, toDate);
        this.loadItems();
    }

    dataStateChange(state: DataStateChangeEvent): void {
        state.group.map(
                group => group.aggregates = this.aggregates);

        this.state = state;
        console.log(state);
        this.loadItems();
    }

    loadItems() {
        this.expenseService.getAll((options) => this.filterHelper.buildRequest(options, this.state))
            .subscribe(result => {
                console.log('Get result: ', result);

                for (let item of result.data) {
                    item.date_Day = new Date(item.date.getFullYear(), item.date.getMonth(), item.date.getDate());
                }

                this.items = process(result.data, this.state);
                this.total = result.data
                    .map(x => x.amount)
                    .reduce((c, n) => c + n, 0);

                var daysCount = 7;

                this.averagePerDay = this.total / daysCount;
            });
    }

    printReport() {
        window.print();
    }
}
