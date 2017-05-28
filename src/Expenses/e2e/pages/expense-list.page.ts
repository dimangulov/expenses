import {element, by} from "protractor"
import {ExpenseRowControl} from "./expense-row.control";

export class ExpenseListPage {
    addNewLink() {
        return element(by.linkText("Add new expense"));
    }

    reportLink() {
        return element(by.linkText("Go to a weekly report"));
    }

    getFirstRow(): ExpenseRowControl {
        var row = element(by.css("tbody > tr:first-child"));

        return new ExpenseRowControl(row);
    }
}