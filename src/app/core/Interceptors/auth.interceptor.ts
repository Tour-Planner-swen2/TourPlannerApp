import { HttpInterceptorFn, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwt_token');
  let clonedRequest = req;

  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

  }

  return next(clonedRequest).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        const refreshedToken = event.headers.get('X-Refreshed-Token');

        if (refreshedToken) {
          localStorage.setItem('jwt_token', refreshedToken);
        }
      }
    }),
  );
};
