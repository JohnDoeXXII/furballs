import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

// Initialize the TestBed environment without Zone.js (zoneless tests)
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
