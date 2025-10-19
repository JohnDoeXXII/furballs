import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { Router } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        { provide: Router, useValue: routerSpy },
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

  it('navigateTo should call router.navigate', () => {
    component.navigateTo('intake');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['intake']);
  });

  it('clicking nav link should call navigate', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstLink = compiled.querySelector('nav ul li a');
    expect(firstLink).toBeTruthy();
    (firstLink as HTMLElement).click();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('toggleSidebar should flip sidebarVisible and button should toggle it', () => {
    const initial = component.sidebarVisible;
    component.toggleSidebar();
    expect(component.sidebarVisible).toBe(!initial);

    // Now click the button in template and ensure it toggles
    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(component.sidebarVisible).toBe(initial);
  });
});
