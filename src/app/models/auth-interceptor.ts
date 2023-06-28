import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class AuthInterceptor  implements HttpInterceptor {
    constructor(private auth: AuthenticationService) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler) {
        if (!req.headers.get('auth')) return next.handle(req);

        let token = this.auth.token;
        if (token === null)
            token = "";
        const authReq = req.clone({
            headers: req.headers.set('Authorization', token)
        });
        return next.handle(authReq);
    }
}
