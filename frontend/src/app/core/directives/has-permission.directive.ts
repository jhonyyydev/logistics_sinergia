import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core"
import { AuthService } from "../services/auth.service"
import { Subject, takeUntil } from "rxjs"

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private authService = inject(AuthService)
  private templateRef = inject(TemplateRef<any>)
  private viewContainer = inject(ViewContainerRef)
  private destroy$ = new Subject<void>()

  @Input() appHasPermission!: string | string[]

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
    const permissions = Array.isArray(this.appHasPermission) ? this.appHasPermission : [this.appHasPermission]

    if (this.authService.hasAnyPermission(permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainer.clear()
    }
  }
}
