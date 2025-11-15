import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { UserListComponent, LINK_RENDERER } from './user-list.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';
import { configureTestingModule, LinkRendererStubComponent } from '../../../test-resources/test-helpers';

describe('UserListComponent', () => {
  let fixture: any;
  let component: UserListComponent;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAll']);
    userServiceSpy.getAll.and.returnValue(of([]));

    await configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: LINK_RENDERER, useValue: LinkRendererStubComponent }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
