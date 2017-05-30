import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {
    model = {
        newPassword: "",
        confirmation: ""
    };

    @Output()
    onSubmit: EventEmitter<string> = new EventEmitter<string>();

    submit() {
        this.onSubmit.emit(this.model.newPassword);
    }
}