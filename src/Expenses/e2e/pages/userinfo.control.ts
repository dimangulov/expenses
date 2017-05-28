import {element, by} from "protractor"

export class UserInfoControl
{
    userInfo() {
        return element(by.id("userInfo"));
    }

    logoutLink() {
        return element(by.id("logoutLink"));
    }
    isPresent() {
        return this.logoutLink().isPresent();
    }
}