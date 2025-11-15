import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Link } from './link.component';

describe('Link', () => {
  let component: Link;
  let fixture: ComponentFixture<Link>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Link],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Link);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders anchor with default text and empty href', () => {
    const el: HTMLElement = fixture.nativeElement;
    const a = el.querySelector('a') as HTMLAnchorElement;
    expect(a).toBeTruthy();
    expect(a.textContent?.trim()).toBe('View');
    expect(a.getAttribute('href')).toBe('/');
  });

  it('binds inputs to anchor attributes', () => {
    component.hrefVal = '/test/1';
    component.text = 'Open';
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(a.textContent?.trim()).toBe('Open');
    expect(a.getAttribute('href')).toBe('/test/1');
  });
});
