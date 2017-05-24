import { Component, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'expense-list',
    templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {

    // Use "constructor"s only for dependency injection
    constructor() { }

    // Here you want to handle anything with @Input()'s @Output()'s
    // Data retrieval / etc - this is when the Component is "ready" and wired up
    ngOnInit() { }
}
