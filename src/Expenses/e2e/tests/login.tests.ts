import {browser, element, by, By, $, $$, ExpectedConditions, Config} from 'protractor';
//import {describe, it} from 'jasmine';
import {LoginPage} from "../pages/login.page";
import {UserInfoControl} from "../pages/user-info.control";
import {config} from "../e2e.config";
   
describe('expense login page', () => {
    let loginPage = new LoginPage();
    let userInfoControl = new UserInfoControl();

    beforeAll((done) => {
        browser.get(config.baseUrl);

        userInfoControl.isPresent().then(isPresent => {
            if (isPresent) {
                userInfoControl.logoutLink().click();
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

    it('should be able to login', () => {
        expect(userInfoControl.logoutLink().isPresent())
            .toBeFalsy();

        loginPage.loginWithDefault();

        expect(userInfoControl.userInfo().isPresent()).toBeTruthy();
    });
});