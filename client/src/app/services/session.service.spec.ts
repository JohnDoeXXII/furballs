import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { LoginResponse, User } from './user.service';
import { TestUser } from '../../test-resources/test-user.model';

describe('SessionService', () => {
  let service: SessionService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};
    
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageMock[key] || null;
    });
    
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete localStorageMock[key];
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('On create', () => {
    it('should initialize with null token and user when localStorage is empty', () => {
      expect(service.token()).toBeNull();
      expect(service.user()).toBeNull();
    });

    it('should reconstitute token from localStorage', () => {
      const testToken = 'test-jwt-token-123';
      localStorageMock['jwt_token_key'] = testToken;
      
      // Create new instance to trigger constructor/ngOnInit
      const newService = new SessionService();
      
      expect(newService.token()).toBe(testToken);
    });

    it('should reconstitute user from localStorage', () => {
      const testUser = TestUser.createUser({
        id: '123',
        username: 'testuser',
        email: 'test@example.com'
      });
      
      localStorageMock['jwt_token_body'] = JSON.stringify(testUser);
      
      // Create new instance to trigger constructor/ngOnInit
      const newService = new SessionService();
      
      const user = newService.user();
      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
      expect(user?.email).toBe('test@example.com');
    });

    it('should reconstitute both token and user from localStorage', () => {
      const testToken = 'test-jwt-token-456';
      const testUser = TestUser.createUser({ username: 'anotheruser', isAdmin: true });
      
      localStorageMock['jwt_token_key'] = testToken;
      localStorageMock['jwt_token_body'] = JSON.stringify(testUser);
      
      // Create new instance to trigger constructor/ngOnInit
      const newService = new SessionService();
      
      expect(newService.token()).toBe(testToken);
      expect(newService.user()?.username).toBe('anotheruser');
      expect(newService.user()?.isAdmin).toBe(true);
    });

    it('should handle invalid JSON in localStorage gracefully', () => {
      const consoleSpy = spyOn(console, 'error');
      localStorageMock['jwt_token_body'] = 'invalid-json{';
      
      // Create new instance to trigger constructor/ngOnInit
      const newService = new SessionService();
      
      expect(newService.user()).toBeNull();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to parse stored user data:', jasmine.any(Error));
      expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token_body');
    });
  });

  describe('setSession', () => {
    it('should store token and user in localStorage', () => {
      const loginResponse: LoginResponse = {
        token: 'new-token-789',
        user: TestUser.createUser({
          id: '789',
          username: 'newuser',
          email: 'new@example.com',
          firstName: 'New',
          lastName: 'User'
        })
      };

      service.setSession(loginResponse);

      expect(localStorage.setItem).toHaveBeenCalledWith('jwt_token_key', 'new-token-789');
      expect(localStorage.setItem).toHaveBeenCalledWith('jwt_token_body', JSON.stringify(loginResponse.user));
    });

    it('should update token and user signals', () => {
      const loginResponse: LoginResponse = {
        token: 'signal-token-123',
        user: TestUser.createUser({
          id: '111',
          username: 'signaluser',
          email: 'signal@example.com',
          firstName: 'Signal',
          lastName: 'User'
        })
      };

      service.setSession(loginResponse);

      expect(service.token()).toBe('signal-token-123');
      expect(service.user()?.username).toBe('signaluser');
      expect(service.user()?.email).toBe('signal@example.com');
    });

    it('should handle null user', () => {
      const loginResponse: LoginResponse = {
        token: 'token-without-user',
        user: null as any
      };

      service.setSession(loginResponse);

      expect(localStorage.setItem).toHaveBeenCalledWith('jwt_token_key', 'token-without-user');
      expect(localStorage.setItem).toHaveBeenCalledWith('jwt_token_body', '');
      expect(service.token()).toBe('token-without-user');
      expect(service.user()).toBeNull();
    });
  });

  describe('clearSession', () => {
    it('should remove token and user from localStorage', () => {
      // Set up initial session
      const loginResponse: LoginResponse = {
        token: 'clear-test-token',
        user: TestUser.createUser({
          id: '999',
          username: 'clearuser',
          email: 'clear@example.com',
          firstName: 'Clear',
          lastName: 'User'
        })
      };

      service.setSession(loginResponse);
      service.clearSession();

      expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token_key');
      expect(localStorage.removeItem).toHaveBeenCalledWith('jwt_token_body');
    });

    it('should set token and user signals to null', () => {
      // Set up initial session
      const loginResponse: LoginResponse = {
        token: 'to-be-cleared',
        user: TestUser.createUser({
          id: '888',
          username: 'cleareduser',
          email: 'cleared@example.com',
          firstName: 'Cleared',
          lastName: 'User'
        })
      };

      service.setSession(loginResponse);
      
      // Verify session is set
      expect(service.token()).toBe('to-be-cleared');
      expect(service.user()).toBeTruthy();

      // Clear session
      service.clearSession();

      expect(service.token()).toBeNull();
      expect(service.user()).toBeNull();
    });
  });

  describe('token and user signals', () => {
    it('should return readonly signals', () => {
      const tokenSignal = service.token;
      const userSignal = service.user;

      expect(tokenSignal).toBeDefined();
      expect(userSignal).toBeDefined();
      
      // Signals should be callable
      expect(typeof tokenSignal).toBe('function');
      expect(typeof userSignal).toBe('function');
    });

    it('should react to session changes', () => {
      const loginResponse: LoginResponse = {
        token: 'reactive-token',
        user: TestUser.createUser({
          id: '555',
          username: 'reactiveuser',
          email: 'reactive@example.com',
          firstName: 'Reactive',
          lastName: 'User'
        })
      };

      // Initial state
      expect(service.token()).toBeNull();
      expect(service.user()).toBeNull();

      // Set session
      service.setSession(loginResponse);
      expect(service.token()).toBe('reactive-token');
      expect(service.user()?.username).toBe('reactiveuser');

      // Clear session
      service.clearSession();
      expect(service.token()).toBeNull();
      expect(service.user()).toBeNull();
    });
  });
});

