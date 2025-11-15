import { Component, Input, Type } from '@angular/core';
import { TestBed, TestModuleMetadata } from '@angular/core/testing';

/**
 * Stub component for the Link component that doesn't require router setup
 */
@Component({
  selector: 'app-link',
  standalone: true,
  template: '<a [href]="hrefVal">{{ text }}</a>'
})
class LinkStubComponent {
  @Input('href') hrefVal: string = '/';
  @Input() text: string = 'View';
}

/**
 * Stub component for the LinkRenderer component that doesn't require router setup
 */
@Component({
  selector: 'app-link-renderer',
  standalone: true,
  template: '<a [href]="href">{{ text }}</a>'
})
export class LinkRendererStubComponent {
  href: string = '';
  text: string = 'View';
  
  agInit(params: any): void {
    if (params && params.getHref && params.data.id) {
      if (params.getHref && typeof params.getHref === 'function') {
        this.href = params.getHref(params.data);
      }
    }
    if (params && params.text) this.text = params.text;
  }
  
  refresh(params: any): boolean {
    return false;
  }
}

interface ComponentStubConfig {
  name: string;
  selector: string;
  stub: Type<any>;
}

/**
 * Registry of all component stubs to automatically apply in tests
 * Add new stubs here to make them available across all tests
 */
const COMPONENT_STUB_REGISTRY: ComponentStubConfig[] = [
  {
    name: 'Link',
    selector: 'app-link',
    stub: LinkStubComponent
  },
  {
    name: 'LinkRendererComponent',
    selector: 'app-link-renderer',
    stub: LinkRendererStubComponent
  }
];

/**
 * Enhanced TestBed configuration that automatically stubs common components
 * to avoid router and other dependency setup in unit tests.
 */
export function configureTestingModule(moduleDef: TestModuleMetadata) {
  const testBed = TestBed.configureTestingModule(moduleDef);
  
  if (!moduleDef.imports) {
    return testBed;
  }
  
  let result = testBed;
  
  for (const imported of moduleDef.imports) {
    if (!imported || typeof imported !== 'function') {
      continue;
    }
    
    const deps = getComponentDependencies(imported);
    if (!deps) continue;
    
    for (const stubConfig of COMPONENT_STUB_REGISTRY) {
      const matchingDep = findMatchingDependency(deps, stubConfig);
      
      if (matchingDep) {
        result = result.overrideComponent(imported, {
          remove: { imports: [matchingDep] },
          add: { imports: [stubConfig.stub] }
        });
      }
    }
  }
  
  return result;
}

function getComponentDependencies(component: any): any[] | null {
  const metadata = component.ɵcmp;
  if (!metadata) return null;
  
  const deps = metadata.dependencies?.();
  return (deps && Array.isArray(deps)) ? deps : null;
}

function findMatchingDependency(deps: any[], stubConfig: ComponentStubConfig): any {
  return deps.find((dep: any) => isDependencyMatch(dep, stubConfig));
}

function isDependencyMatch(dep: any, stubConfig: ComponentStubConfig): boolean {

  if (dep.name === stubConfig.name) {
    return true;
  }
  
  const depSelectors = dep.ɵcmp?.selectors;
  if (depSelectors && Array.isArray(depSelectors)) {
    // selectors is typically an array of arrays like [['app-link']]
    return depSelectors.some((selectorArr: any[]) => 
      selectorArr.includes(stubConfig.selector)
    );
  }
  
  return false;
}
