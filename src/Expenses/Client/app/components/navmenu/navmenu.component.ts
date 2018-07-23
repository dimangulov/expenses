import { Component } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { IUser, Roles } from '../../models/IUser';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
    user: IUser;
    userIsLogged: boolean;
    userSubscription: any;
    userLogoutSubscription: any;

    showUsersSection = false;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.userSubscription = this.authService.userLoggedIn.subscribe(u => {
            this.userIsLogged = true;
            this.user = u;
            this.showUsersSection = this.user.roles
                .filter(r => r == Roles.Administrator || r == Roles.Manager)
                .length > 0;
        });

        this.userLogoutSubscription = this.authService.userLoggedOut.subscribe(u => {
            this.userIsLogged = false;
            this.user = <IUser>null;
        });
    }

    ngOnDestroy(): void {
        this.userIsLogged = false;
        this.user = <IUser>null;

        this.userSubscription.unsubscribe();;
        this.userLogoutSubscription.unsubscribe();;
    }
}
