import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthenticationService } from "./authentication.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (!req.withCredentials) return next(req);
    const token = inject(AuthenticationService).getToken ?? "";
    const authReq = req.clone({
        headers: req.headers.set('authToken', token),
        withCredentials: false
    });
    return next(authReq);
}
