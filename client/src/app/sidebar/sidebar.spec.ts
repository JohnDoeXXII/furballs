import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Sidebar } from './sidebar';
import { Router } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true)); 

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

  it('clicking nav link should call navigate', fakeAsync(() => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstLink = compiled.querySelector(`*[data-testid='intake-button']`);
    expect(firstLink).toBeTruthy();
    (firstLink as HTMLElement).click();
    tick();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/intake']);
  }));

  it('toggleSidebar should flip sidebarVisible and button should toggle it', () => {
    const initial = component.sidebarVisible;
    component.toggleSidebar();
    expect(component.sidebarVisible).toBe(!initial);

    const btn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(component.sidebarVisible).toBe(initial);
  });
});
