import {element, by, ElementFinder, promise} from "protractor"

export class ExpenseRowControl {
    constructor(private rowElement:ElementFinder) {}

    amount():promise.Promise<number> {
        return this.getCell(0).getText().then(x => Number(x));
    }

    date():promise.Promise<Date> {
        return this.getCell(1).getText().then(x => new Date(x));
    }

    description():promise.Promise<string> {
        return this.getCell(2).getText();
    }

    comment():promise.Promise<string> {
        return this.getCell(3).getText();
    }

    username():promise.Promise<string> {
        return this.getCell(4).getText();
    }

    edit() {
        return this.getCell(5).all(by.tagName("button")).get(0);
    }

    delete() {
        return this.getCell(5).all(by.tagName("button")).get(1);
    }

    private getCell(index: number): ElementFinder {
        return this.rowElement.all(by.tagName("td")).get(index);
    }

    isPresent() {
        return this.rowElement.isPresent()
            .then(x => {
                if (x) {
                    return this.getCell(0).isPresent();
                }

                return false;
            });
    }
}