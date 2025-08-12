import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { Subject, takeUntil } from "rxjs"

@Directive({
  selector: '[appIfAuthenticated]',
  standalone: true
})
export class IfAuthenticatedDirective implements OnInit, OnDestroy {
  private authService = inject(AuthService)
  private templateRef = inject(TemplateRef<any>)
  private viewContainer = inject(ViewContainerRef)
  private destroy$ = new Subject<void>()

  @Input() appIfAuthenticated: boolean = true

  ngOnInit() {
    // Escuchar cambios en el usuario actual
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView()
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private updateView() {
    const isAuthenticated = this.authService.isAuthenticated()

    if ((isAuthenticated && this.appIfAuthenticated) || (!isAuthenticated && !this.appIfAuthenticated)) {
      this.viewContainer.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainer.clear()
    }
  }
}
