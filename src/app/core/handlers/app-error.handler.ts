import { ErrorHandler, Injectable } from '@angular/core';
import { ZodError } from 'zod';

@Injectable({ providedIn: 'root' })
export class AppErrorHandler implements ErrorHandler {
  public handleError(error: any): void {
    const originalError = error.originalError || error;

    if (originalError instanceof ZodError) {
      console.error(
        "[Forteresse Central] Capture d'une tentative d'intrusion de données API corrompues.",
        originalError.issues,
      );
      return;
    }

    console.error('Unhandled System Error:', originalError);
  }
}
