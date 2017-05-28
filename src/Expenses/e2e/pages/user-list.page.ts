import {element, by} from "protractor"
import { UserRowControl} from "./user-row.control";

export class UserListPage {
    getFirstRow(): UserRowControl {
        var row = element(by.css("tbody > tr:nth-child(2)"));

        return new UserRowControl(row);
    }
}