import { PollCreateViewComponent } from '@features/polls/presentation/containers/poll-create-view.component';
import { Component, inject, OnInit } from '@angular/core';
import { PollCreateFacade } from '@features/polls/presentation/facade/poll-create.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-create-page',
  imports: [PollCreateViewComponent],
  providers: [PollCreateFacade],
  template: `<app-poll-create-view></app-poll-create-view>`,
})
export class PollCreatePageComponent implements OnInit {
  private readonly facade = inject(PollCreateFacade);
  private readonly router = inject(Router);

  public ngOnInit(): void {
    this.facade.checkAccess(
      () => {
        void this.router.navigate(['/auth/login']);
      }, // Si non connecté
      () => {
        void this.router.navigate(['/member']);
      }, // Si non autorisé
    );
  }
}
