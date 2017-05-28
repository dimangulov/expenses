import {element, by} from "protractor"

export class LoginPage {
    username() {
        return element(by.name("username"));
    }

    password() {
        return element(by.name("password"));
    }

    login() {
        return element(by.buttonText("Login"));
    }

    register() {
        return element(by.buttonText("Login"));
    }

    loginWithDefault() {
        this.username().sendKeys("admin");
        this.password().sendKeys("admin");
        this.login().click();
    }

    isPresent() {
        return this.login().isPresent();
    }
}