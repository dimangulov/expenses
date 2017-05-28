import {browser, element, by, By, $, $$, ExpectedConditions, Config} from 'protractor';
//import {describe, it} from 'jasmine';
import {LoginPage} from "../pages/login.page";
import {UserInfoControl} from "../pages/user-info.control"
import {config} from "../e2e.config";
   
describe('expense logout page', () => {
    let loginPage = new LoginPage();
    let userInfoControl = new UserInfoControl();    

    beforeAll((done) => {
        browser.get(config.baseUrl);

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

    it('should show information about the current user', () => {
        expect(userInfoControl.userInfo().isPresent()).toBeTruthy();
        expect(userInfoControl.userInfo().getText()).toBe(<any>"admin admin");
    });

    it('should should show logout link', () => {
        expect(userInfoControl.logoutLink().isPresent())
            .toBeTruthy();
    });

    it('should redirect user to login page', () => {
        expect(loginPage.isPresent())
            .toBeFalsy();

        userInfoControl.logoutLink().click();

        expect(loginPage.isPresent())
            .toBeTruthy();
    });
});