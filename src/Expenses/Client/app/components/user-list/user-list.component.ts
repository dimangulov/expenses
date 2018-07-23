import { Component, OnInit } from '@angular/core';
import { UserService } from "../../shared/user.service";
import { FilterHelper } from "../../shared/filter.helper";
import { GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { IUser } from "../../models/IUser";

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    items: GridDataResult;

    state: State = {
        skip: 0,
        take: 25,
        filter: null,
        sort: [
            {
                dir: "asc",
                field: "username"
            }]
    };

    // Use "constructor"s only for dependency injection
    constructor(
        private userService: UserService,
        private filterHelper: FilterHelper,
        private router: Router) { }

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
        this.userService.getAll((options) => this.filterHelper.buildRequest(options, this.state))
            .subscribe(result => {
                this.items = result;
            });
    }

    editHandler({dataItem}) {
        console.log(dataItem);
        this.router.navigate(["users", dataItem.id, "edit"]);
    }

    removeHandler({ dataItem }: {dataItem: IUser}) {
        console.log(dataItem);
        this.userService.delete(dataItem)
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

    reduceRoles(roles: string[]) {
        return roles.reduce((c, n) => c + (c == "" ? "" : ", ") + n, "");
    }
     
    setPassword(dataItem:IUser) {
        console.log(dataItem);
        this.router.navigate(["users", dataItem.id, "password"]);
    }
}
