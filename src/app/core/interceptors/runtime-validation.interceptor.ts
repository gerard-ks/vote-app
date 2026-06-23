import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Z_SCHEMA } from '@core/interceptors/zod-context';
import { map } from 'rxjs/operators';

export const runtimeValidationInterceptor: HttpInterceptorFn = (req, next) => {
  const schema = req.context.get(Z_SCHEMA);

  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && schema) {
        try {
          const validatedBody = schema.parse(event.body);
          return event.clone({ body: validatedBody });
        } catch (zodError) {
          console.error(
            `[Contrat API Rompu] Échec de conformité au runtime : ${req.url}`,
            zodError,
          );
          throw zodError;
        }
      }
      return event;
    }),
  );
};
