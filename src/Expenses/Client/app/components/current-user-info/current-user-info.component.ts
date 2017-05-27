import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '../../security/auth.service';
import { Router} from '@angular/router';

@Component({
    selector: 'current-user-info',
    templateUrl: './current-user-info.component.html',
    styleUrls: [
        "./current-user-info.component.css"
    ]
})
export class CurrentUserInfoComponent implements OnInit, OnDestroy {
    user: any;
    userIsLogged: boolean;
    userSubscription: any;
    userLogoutSubscription: any;

    constructor(private authService: AuthService, private router: Router) {
    }

    ngOnInit(): void {
        this.userSubscription = this.authService.userLoggedIn.subscribe(u => {
            this.userIsLogged = true;
            this.user = u;
        });

        this.userLogoutSubscription = this.authService.userLoggedOut.subscribe(u => {
            this.userIsLogged = false;
            this.user = null;
        });
    }

    ngOnDestroy(): void {
        this.userIsLogged = false;
        this.user = null;

        this.userSubscription.unsubscribe();;
        this.userLogoutSubscription.unsubscribe();;
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
