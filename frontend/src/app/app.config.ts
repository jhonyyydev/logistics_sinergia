import type { ApplicationConfig } from "@angular/core"
import { provideRouter } from "@angular/router"
import { provideAnimations } from "@angular/platform-browser/animations"
import { routes } from "./app.routes"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { authInterceptor } from "@/core/interceptors/auth.interceptor"

export const appConfig: ApplicationConfig = {
  providers: [
    // Router
    provideRouter(routes),

    // Animaciones
    provideAnimations(),
    provideHttpClient(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
}
