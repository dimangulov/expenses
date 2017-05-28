import {browser, element, by, By, $, $$, ExpectedConditions, Config} from 'protractor';
//import {describe, it} from 'jasmine';
import {LoginPage} from "../pages/login.page";
import {UserInfoControl} from "../pages/user-info.control";
import {config} from "../e2e.config";
import {ExpenseListPage} from "../pages/expense-list.page";
import {ExpenseFormPage} from "../pages/expense-form.page";

describe('expense login page', () => {
    let loginPage = new LoginPage();
    let userInfoControl = new UserInfoControl();
    let expenseList = new ExpenseListPage();
    let expenseForm = new ExpenseFormPage();

    beforeAll((done) => {
        browser.get(config.baseUrl + "/expenses");

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

    it('should add new expense', () => {
        expenseList.addNewLink().click();

        let expense = {
            amount: Math.round(Math.random() * 100),
            date: new Date(),
            comment: Math.random().toString(),
            description: "E2E_" + new Date()
        };

        expense.date.setSeconds(0);
        expense.date.setMilliseconds(0);

        expenseForm.amount().sendKeys(expense.amount);
        expenseForm.setDate(expense.date);
        expenseForm.comment().sendKeys(expense.comment);
        expenseForm.description().sendKeys(expense.description);

        expenseForm.save().click();
        
        let firstRow = expenseList.getFirstRow();

        browser.wait(firstRow.isPresent());

        expect(firstRow.amount()).toBe(<any>expense.amount);
        expect(firstRow.date().then(d => JSON.stringify(d))).toBe(<any>JSON.stringify(expense.date));
        expect(firstRow.comment()).toBe(<any>expense.comment);
        expect(firstRow.description()).toBe(<any>expense.description);
        expect(firstRow.username()).toBe(<any>"admin");
    });
});