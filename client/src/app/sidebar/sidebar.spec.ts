import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { Router, ActivatedRoute, RouterLink, provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { AnimalService } from '../services/animal.service';
import { SessionService } from '../services/session.service';
import { of } from 'rxjs';
import { configureTestingModule } from '../../test-resources/test-helpers';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let routerSpy: jasmine.SpyObj<Router>;
  let animalService: jasmine.SpyObj<AnimalService>;
  let sessionServiceSpy: jasmine.SpyObj<SessionService>;
  let localStorageMock: { [key: string]: string };

  beforeEach(async () => {
    // Mock window.innerWidth to simulate desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920
    });

    // Mock localStorage
    localStorageMock = {};
    
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageMock[key] || null;
    });
    
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true)); 
    animalService = jasmine.createSpyObj('AnimalService', ['getAnimalCountByType']);
    animalService.getAnimalCountByType.and.callFake((type: string) => {
      if (type === 'Cat') return of(5);
      if (type === 'Dog') return of(3);
      return of(0);
    });

    sessionServiceSpy = jasmine.createSpyObj('SessionService', ['clearSession'], {
      user: jasmine.createSpy().and.returnValue(null),
      token: jasmine.createSpy().and.returnValue(null)
    }); 

    await configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: {} },
        { provide: AnimalService, useValue: animalService },
        { provide: SessionService, useValue: sessionServiceSpy },
        { provide: RouterLink, useValue: sessionServiceSpy },
        provideZoneChangeDetection(),
      ],

    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleSidebar should flip sidebarVisible and button should toggle it', () => {
    const initial = component.sidebarVisible();
    component.toggleSidebar();
    expect(component.sidebarVisible()).toBe(!initial);

    const btn = fixture.nativeElement.querySelector('[data-testid="toggle-button"]') as HTMLElement;
    btn.click();
    fixture.detectChanges();
    expect(component.sidebarVisible()).toBe(initial);
  });

  it('should display cat and dog count pills', fakeAsync(() => {
    tick(); // Allow observables to complete
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const pills = compiled.querySelectorAll('.inline-flex.items-center.justify-center');
    
    expect(pills.length).toBeGreaterThanOrEqual(2);
    
    // Check for cat count (5)
    const catPill = Array.from(pills).find(pill => pill.textContent?.trim() === '5');
    expect(catPill).toBeTruthy();
    
    // Check for dog count (3)
    const dogPill = Array.from(pills).find(pill => pill.textContent?.trim() === '3');
    expect(dogPill).toBeTruthy();
  }));

  it('should load sidebar state from localStorage', () => {
    // Set localStorage value before creating component
    localStorageMock['sidebarVisible'] = 'false';
    
    // Create new component instance
    const newFixture = TestBed.createComponent(Sidebar);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    
    expect(newComponent.sidebarVisible()).toBe(false);
  });

  it('should save sidebar state to localStorage when toggling', () => {
    const initial = component.sidebarVisible();
    component.toggleSidebar();
    
    expect(localStorage.setItem).toHaveBeenCalledWith('sidebarVisible', (!initial).toString());
  });
});
