import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Ng2BootstrapModule } from 'ng2-bootstrap';

// i18n support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ExpenseReportComponent } from './components/expense-report/expense-report.component';
import { ExpensesComponent } from './containers/expenses/expenses.component';
import { UsersComponent } from './containers/users/users.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

import { LinkService } from './shared/link.service';
import { UserService } from './shared/user.service';
import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from './shared/constants/baseurl.constants';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';
 
import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from "./containers/login/login.component";
import { RegisterComponent } from "./containers/register/register.component";
import { AuthService } from "./security/auth.service";
import { AlertService } from "./shared/alert.service";
import { HttpService } from "./shared/http.service";
import { ExpenseService } from "./shared/expense.service";
import { FilterHelper } from "./shared/filter.helper";
import { AlertComponent } from './components/alert/alert.component';
import { CurrentUserInfoComponent } from './components/current-user-info/current-user-info.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeMyPasswordComponent } from './containers/change-my-password/change-my-password.component';
import { ChangeUserPasswordComponent } from './containers/change-user-password/change-user-password.component';

import { GridModule } from '@progress/kendo-angular-grid';
import { ExpenseResolve} from "./resolvers/expense.resolver";
import { UserResolve} from "./resolvers/user.resolver";
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

export function createTranslateLoader(http: Http, baseHref) {
    // Temporary Azure hack
    if (baseHref === null && typeof window !== 'undefined') {
        baseHref = window.location.origin;
    }
    // i18n files are in `wwwroot/assets/`
    return new TranslateHttpLoader(http, `${baseHref}/assets/i18n/`, '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        UsersComponent,
        ExpenseListComponent,
        NotFoundComponent,
        LoginComponent,
        AlertComponent,
        CurrentUserInfoComponent,
        ExpenseFormComponent,
        ExpenseReportComponent,
        ExpensesComponent,
        RegisterComponent,
        UserListComponent,
        UserFormComponent,
        ChangePasswordComponent,
        ChangeMyPasswordComponent,
        ChangeUserPasswordComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        Ng2BootstrapModule.forRoot(), // You could also split this up if you don't want the Entire Module imported

        TransferHttpModule, // Our Http TransferData method

        // i18n support
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http, [ORIGIN_URL]]
            }
        }),

        GridModule,
        DateInputsModule,

        // App Routing
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'expenses',
                pathMatch: 'full'
            },
            {
                path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard],
                children: [
                    { path: '', component: ExpenseListComponent },
                    { path: 'add', component: ExpenseFormComponent },
                    { path: ':id/edit', component: ExpenseFormComponent, resolve: { expense: ExpenseResolve} },
                    { path: 'report', component: ExpenseReportComponent} 
                ] 
            },
            {
                path: 'users', component: UsersComponent, canActivate: [AuthGuard],
                children: [
                    { path: '', component: UserListComponent },
                    { path: ':id/edit', component: UserFormComponent, resolve: { user: UserResolve } },
                    { path: ':id/password', component: ChangeUserPasswordComponent}
                ]
            },
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'password', component: ChangeMyPasswordComponent, canActivate: [AuthGuard]},
        ])
    ],
    providers: [
        LinkService,
        UserService,
        ConnectionResolver,
        TranslateModule,
        AuthGuard,
        AuthService,
        AlertService,
        HttpService,
        ExpenseService,
        FilterHelper,
        ExpenseResolve,
        UserResolve
    ]
})
export class AppModule {
}
