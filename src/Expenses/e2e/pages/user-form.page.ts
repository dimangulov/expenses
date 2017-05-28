import {element, by, ElementFinder, Key, browser} from "protractor"

export class UserFormPage {
    username():ElementFinder {
        return element(by.name("username"));
    }

    firstName(): ElementFinder {
        return element(by.name("firstName"));
    }

    lastName(): ElementFinder {
        return element(by.name("lastName"));
    }

    save() {
        return element(by.buttonText("Save"));
    }
}