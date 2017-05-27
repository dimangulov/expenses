import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../shared/user.service';
import { IUser} from "../models/IUser";

@Injectable()
export class UserResolve implements Resolve<IUser> {

    constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot) {
      return this.userService.getOne(route.paramMap.get('id'));
  }
}