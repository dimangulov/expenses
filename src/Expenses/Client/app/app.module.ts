import { NgModule, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { HttpModule, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { Ng2BootstrapModule } from 'ng2-bootstrap';

// i18n support
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { ExpenseListComponent } from './containers/expense-list/expense-list.component';
import { UsersComponent } from './containers/users/users.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { NotFoundComponent } from './containers/not-found/not-found.component';

import { LinkService } from './shared/link.service';
import { UserService } from './shared/user.service';
import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from './shared/constants/baseurl.constants';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

import { AuthGuard } from './security/auth.guard';
import { LoginComponent } from "./containers/login/login.component";
import { AuthService } from "./security/auth.service";
import { AlertService } from "./shared/alert.service";
import { HttpService } from "./shared/http.service";
import { ExpenseService } from "./shared/expense.service";
import { AlertComponent } from './components/alert/alert.component';
import { CurrentUserInfoComponent } from './components/current-user-info/current-user-info.component';

import { GridModule } from '@progress/kendo-angular-grid';


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
        UserDetailComponent,
        ExpenseListComponent,
        NotFoundComponent,
        LoginComponent,
        AlertComponent,
        CurrentUserInfoComponent
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

        // App Routing
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'expenses',
                pathMatch: 'full'
            },
            {
              path: 'expenses', component: ExpenseListComponent, canActivate: [AuthGuard]
            },
            {
              path: 'users', component: UsersComponent, canActivate: [AuthGuard]
            },
            { path: 'login', component: LoginComponent }
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
        ExpenseService
    ]
})
export class AppModule {
}
