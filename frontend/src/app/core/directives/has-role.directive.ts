import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, OnDestroy } from '@angular/core'
import { AuthService } from '../../core/services/auth.service'
import { Subject, takeUntil } from 'rxjs'

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private authService = inject(AuthService)
  private templateRef = inject(TemplateRef<any>)
  private viewContainer = inject(ViewContainerRef)
  private destroy$ = new Subject<void>()

  @Input() appHasRole!: string | string[]

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
    const roles = Array.isArray(this.appHasRole) ? this.appHasRole : [this.appHasRole]

    if (this.authService.hasAnyRole(roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef)
    } else {
      this.viewContainer.clear()
    }
  }
}
