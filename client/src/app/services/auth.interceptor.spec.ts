import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { SessionService } from './session.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let sessionService: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideZonelessChangeDetection(),
        SessionService
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    sessionService = TestBed.inject(SessionService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add Authorization header when token is present', () => {
    // Mock the token signal to return a test token
    const testToken = 'test-jwt-token-123';
    spyOn(sessionService, 'token').and.returnValue(testToken);

    // Make a test HTTP request
    httpClient.get('/test-endpoint').subscribe();

    // Verify the request was made with the Authorization header
    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);

    req.flush({});
  });

  it('should not add Authorization header when token is null', () => {
    // Mock the token signal to return null
    spyOn(sessionService, 'token').and.returnValue(null);

    // Make a test HTTP request
    httpClient.get('/test-endpoint').subscribe();

    // Verify the request was made without the Authorization header
    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should not add Authorization header when token is empty string', () => {
    // Mock the token signal to return empty string
    spyOn(sessionService, 'token').and.returnValue('');

    // Make a test HTTP request
    httpClient.get('/test-endpoint').subscribe();

    // Verify the request was made without the Authorization header
    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should preserve existing headers when adding Authorization header', () => {
    const testToken = 'test-jwt-token-456';
    spyOn(sessionService, 'token').and.returnValue(testToken);

    // Make a test HTTP request with custom headers
    httpClient.get('/test-endpoint', {
      headers: {
        'Content-Type': 'application/json',
        'Custom-Header': 'custom-value'
      }
    }).subscribe();

    // Verify all headers are present
    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Custom-Header')).toBe('custom-value');

    req.flush({});
  });

  it('should work with POST requests', () => {
    const testToken = 'test-jwt-token-789';
    spyOn(sessionService, 'token').and.returnValue(testToken);

    const testData = { name: 'Test' };
    httpClient.post('/test-endpoint', testData).subscribe();

    const req = httpMock.expectOne('/test-endpoint');
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${testToken}`);
    expect(req.request.body).toEqual(testData);

    req.flush({});
  });
});
