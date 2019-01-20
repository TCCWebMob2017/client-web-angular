import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user: User;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<User>(`${environment.apiUrl}/usuario/authenticate`, { email, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
               // if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
               // }

                return user;
            }));
           // this.http.post<User>(`${environment.apiUrl}/usuario/authenticate`, { email, password }).subscribe(user => {
            //    this.user = user;
            //    localStorage.setItem('currentUser', JSON.stringify(user));
             //   this.currentUserSubject.next(user);
            //});
            //return this.user;
           /* this.user.email = email;
            this.user.password = password;
            user = this.http.post(`${environment.apiUrl}/usuario/authenticate`, this.user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);*/
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}