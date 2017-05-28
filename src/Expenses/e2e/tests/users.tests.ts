import {browser, element, by, By, $, $$, ExpectedConditions, Config} from 'protractor';
//import {describe, it} from 'jasmine';
import {LoginPage} from "../pages/login.page";
import {UserInfoControl} from "../pages/user-info.control";
import {config} from "../e2e.config";
import {UserListPage} from "../pages/user-list.page";
import {UserFormPage} from "../pages/user-form.page";

describe('user list page', () => {
    let loginPage = new LoginPage();
    let userInfoControl = new UserInfoControl();
    let userList = new UserListPage();
    let userForm = new UserFormPage();

    beforeAll((done) => {
        browser.get(config.baseUrl + "/users");

        loginPage.isPresent().then(isPresent => {
            if (isPresent) {
                loginPage.loginWithDefault();
            }
            
            done();
        });
    });

    afterAll((done) => {
        userInfoControl.isPresent().then(isPresent => {
            if (isPresent) {
                userInfoControl.logoutLink().click();
            }
            
            done();
        });
    });

    it('should edit a user', () => {
        let existinRow = userList.getFirstRow();

        existinRow.edit().click();

        let user = {
            username: "admin_E2E_" + new Date(),
            firstName: "admin_E2E_" + new Date(),
            lastName: "admin_E2E_" + new Date(),
        };

        userForm.username().clear();
        userForm.username().sendKeys(user.username);

        userForm.firstName().clear();
        userForm.firstName().sendKeys(user.firstName);

        userForm.lastName().clear();
        userForm.lastName().sendKeys(user.lastName);

        //browser.sleep(2000);
        userForm.save().click();

        existinRow = userList.getFirstRow();

        browser.wait(existinRow.isPresent());

        expect(existinRow.username()).toBe(<any>user.username);
        expect(existinRow.firstName()).toBe(<any>user.firstName);
        expect(existinRow.lastName()).toBe(<any>user.lastName);
    });

    it('should delete a user', (done) => {
        let existinRow = userList.getFirstRow();

        existinRow.username().then(d => {
            var username = d;

            existinRow.delete().click();

            existinRow = userList.getFirstRow();

            browser.wait(existinRow.isPresent());

            expect(existinRow.username()).not.toBe(<any>username);

            done();
        })
    });
});