import {element, by, ElementFinder, promise} from "protractor"

export class UserRowControl {
    constructor(private rowElement:ElementFinder) {}

    username():promise.Promise<string> {
        return this.getCell(0).getText();
    }

    firstName(): promise.Promise<string> {
        return this.getCell(1).getText();
    }

    lastName(): promise.Promise<string> {
        return this.getCell(2).getText();
    }

    roles(): promise.Promise<string> {
        return this.getCell(3).getText();
    }

    edit() {
        return this.getCell(4).all(by.tagName("button")).get(0);
    }

    delete() {
        return this.getCell(4).all(by.tagName("button")).get(1);
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