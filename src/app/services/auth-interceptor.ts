import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthenticationService } from "./authentication.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.withCredentials) return next(req);
    
    let token = inject(AuthenticationService).token;
    if (token === null)
        token = "";

    const authReq = req.clone({
        headers: req.headers.set('authToken', token),
        withCredentials: false
    });
    return next(authReq);
}
