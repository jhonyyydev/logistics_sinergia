import { type ComponentFixture, TestBed } from "@angular/core/testing"
import { Router } from "@angular/router"
import { HomeComponent } from "./home.component"
import { AuthTokenService } from "@/core/services/auth-token.service"

describe("HomeComponent", () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  let mockRouter: jasmine.SpyObj<Router>
  let mockTokenService: jasmine.SpyObj<AuthTokenService>

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj("Router", ["navigate", "navigateByUrl"])
    const tokenServiceSpy = jasmine.createSpyObj("AuthTokenService", ["removeToken"])

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthTokenService, useValue: tokenServiceSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>
    mockTokenService = TestBed.inject(AuthTokenService) as jasmine.SpyObj<AuthTokenService>
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should logout and navigate to login", () => {
    component.logout()

    expect(mockTokenService.clearToken).toHaveBeenCalled()
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/auth/login")
  })

  it("should navigate to section", () => {
    const section = "clients"
    component.navigateToSection(section)

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/dashboard", section])
  })
})
