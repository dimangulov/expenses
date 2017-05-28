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

        var day:string = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear().toString();
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();

        if (day.length == 1) {
            day = "0" + day;
        }

        if (month.length == 1) {
            month = "0" + month;
        }

        if (hours.length == 1) {
            hours = "0" + hours;
        }

        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }

        browser.actions().click(this.amount().getWebElement())
            .sendKeys(Key.TAB)
            .sendKeys(
                day,
                month, Key.ARROW_RIGHT,
                year,
                hours,
                minutes
            )
        .perform()

        //browser.sleep(10000);
    }

    save() {
        return element(by.buttonText("Save"));
    }
}