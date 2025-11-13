import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkRendererComponent } from './link-renderer.component';

describe('LinkRendererComponent', () => {
  let component: LinkRendererComponent;
  let fixture: ComponentFixture<LinkRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkRendererComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(component).toBeTruthy();
  });

  it('agInit sets href using provided getHref function and text param', () => {
    const params: any = { getHref: (data: any) => `/item/${data.id}`, data: { id: '123' }, text: 'Open' };
    component.agInit(params);
    expect(component.href).toBe('/item/123');
    expect(component.text).toBe('Open');
  });

  it('agInit tolerates missing getHref and data', () => {
    component.agInit({});
    expect(component.href).toBe('');
    expect(component.text).toBe('View');
  });

  it('refresh returns false', () => {
    expect(component.refresh({})).toBeFalse();
  });
});
