import {element, by, ElementFinder, Key, browser} from "protractor"

export class ExpenseFormPage {
    amount():ElementFinder {
        return element(by.name("amount"));
    }

    date():ElementFinder {
        return element(by.name("date")).element(by.tagName("input"));
    }

    description():ElementFinder {
        return element(by.name("description"));
    }

    comment():ElementFinder {
        return element(by.name("comment"));
    }

    setDate(date: Date) {
        let dateField = this.date();

        dateField.sendKeys(
            date.getFullYear(), Key.ARROW_RIGHT,
            date.getHours(), Key.ARROW_RIGHT,
            date.getMinutes(), Key.ARROW_RIGHT,
            Key.ARROW_LEFT, Key.ARROW_LEFT,Key.ARROW_LEFT,Key.ARROW_LEFT,Key.ARROW_LEFT,
            date.getDate(), Key.ARROW_RIGHT,
            date.getMonth() + 1, Key.ARROW_RIGHT
        );

        /*dateField.sendKeys(date.getDate() + 1, Key.TAB);
        browser.sleep(5000);
        dateField.sendKeys(date.getMonth() + 1, Key.TAB);
        browser.sleep(5000);
        dateField.sendKeys(date.getFullYear(), Key.TAB);
        browser.sleep(5000);
        dateField.sendKeys(date.getHours(), Key.TAB);
        browser.sleep(5000);
        dateField.sendKeys(date.getMinutes());*/
        browser.sleep(10000);
    }

    save() {
        return element(by.buttonText("Save"));
    }
}