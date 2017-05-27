import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ExpenseService } from '../shared/expense.service';
import { IExpense} from "../models/IExpense";

@Injectable()
export class ExpenseResolve implements Resolve<IExpense> {

    constructor(private expenseService: ExpenseService) {}

  resolve(route: ActivatedRouteSnapshot) {
      return this.expenseService.getOne(route.paramMap.get('id'));
  }
}