import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "./shared/services/auth.service";
import {ShoppingCartItemService} from "./shared/services/shopping-cart-item.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'bookworm-webkert2023';
    loggedInUser?: firebase.default.User | null;
    cartNumber: number = 0;

    userLoggedInSubscription?: Subscription;
    shoppingCartItemsSubscription?: Subscription;

    constructor(private router: Router, private authService: AuthService, private shoppingCartItemService: ShoppingCartItemService) {
    }

    ngOnInit() {
        this.userLoggedInSubscription = this.authService.isUserLoggedIn().subscribe(user => {

            this.loggedInUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            if (this.loggedInUser) {
                this.shoppingCartItemsSubscription = this.shoppingCartItemService.getAllByUserId(this.loggedInUser.uid).subscribe(shoppingCartItems => {
                    this.cartNumber = 0;
                    for (let i = 0; i < shoppingCartItems.length; i++) {
                        this.cartNumber += shoppingCartItems[i].amount;
                    }
                });
            }

        }, error => {
            console.error(error);
            localStorage.setItem('user', JSON.stringify('null'));
            localStorage.setItem('cred', JSON.stringify('null'));
        });
    }

    ngOnDestroy() {
        this.userLoggedInSubscription?.unsubscribe();
        this.shoppingCartItemsSubscription?.unsubscribe();
    }
}
