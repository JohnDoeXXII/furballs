import { AgPersist } from './ag-persist.mixin';

describe('AgPersist', () => {
  let headStub: any;
  let originalGetItem: any;
  let originalSetItem: any;
  let originalGetElements: any;

  beforeEach(() => {
    // stub head element append/remove
    headStub = { appendChild: jasmine.createSpy('appendChild'), removeChild: jasmine.createSpy('removeChild') };
    originalGetElements = document.getElementsByTagName;
    spyOn(document, 'getElementsByTagName').and.callFake((name: string) => {
      if (name === 'head') {
        return [headStub] as any;
      }
      return originalGetElements.call(document, name as any);
    });

    originalGetItem = localStorage.getItem;
    originalSetItem = localStorage.setItem;
    spyOn(localStorage, 'setItem').and.callFake(() => {});
  });

  afterEach(() => {
    (document.getElementsByTagName as any) = originalGetElements;
    (localStorage.getItem as any) = originalGetItem;
    (localStorage.setItem as any) = originalSetItem;
    if ((jasmine as any).clock && (jasmine as any).clock().installed) {
      try { jasmine.clock().uninstall(); } catch(e) {}
    }
  });

  it('restores filter and scroll on first data rendered when storage present', () => {
    const storedSettings = JSON.stringify({ filterState: { name: { filter: 'x' } }, columnState: [{ colId: 'a' }], groupState: [] });
    const storedScroll = JSON.stringify({ topIndex: 7, leftColumn: 'col-1' });
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === `ag-persist-grid-settings-test-grid`) return storedSettings;
      if (key === `ag-persist-scroll-position-test-grid`) return storedScroll;
      return null;
    });

    const persist = new AgPersist('test-grid');
    const opts = persist.setup();

    const api: any = {
      setFilterModel: jasmine.createSpy('setFilterModel'),
      ensureIndexVisible: jasmine.createSpy('ensureIndexVisible'),
      ensureColumnVisible: jasmine.createSpy('ensureColumnVisible'),
    };
    const params: any = { api };

    opts.onFirstDataRendered?.(params);

    expect(api.setFilterModel).toHaveBeenCalledWith({ name: { filter: 'x' } });
    expect(api.ensureIndexVisible).toHaveBeenCalledWith(7, 'top');
    expect(api.ensureColumnVisible).toHaveBeenCalledWith('col-1', 'start');
  });

  it('applies column state and schedules animation enable on grid ready', () => {
    const storedSettings = JSON.stringify({ columnState: [{ colId: 'a' }], groupState: [] });
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === `ag-persist-grid-settings-grid-ready`) return storedSettings;
      return null;
    });

    const persist = new AgPersist('grid-ready');
    const opts = persist.setup();

    const columnApi: any = {
      applyColumnState: jasmine.createSpy('applyColumnState'),
      setColumnGroupState: jasmine.createSpy('setColumnGroupState'),
    };
    const api: any = {};
    // Use jasmine clock to control setTimeout
    jasmine.clock().install();

    opts.onGridReady?.({ columnApi, api } as any);

    expect(columnApi.applyColumnState).toHaveBeenCalled();
    expect(columnApi.setColumnGroupState).toHaveBeenCalled();
    // animation style added initially
    expect(headStub.appendChild).toHaveBeenCalled();
    // scheduled removal after 500ms
    jasmine.clock().tick(501);
    expect(headStub.removeChild).toHaveBeenCalled();
    jasmine.clock().uninstall();
  });

  it('does not save grid settings until first data rendered sets gridReady', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const persist = new AgPersist('no-save-yet');
    const opts = persist.setup();

    const columnApi: any = { getColumnState: jasmine.createSpy('getColumnState').and.returnValue([]), getColumnGroupState: jasmine.createSpy('getColumnGroupState').and.returnValue([]) };
    const api: any = { getFilterModel: jasmine.createSpy('getFilterModel').and.returnValue({}) };

    // gridReady is false initially; calling drag stopped should not save
    opts.onDragStopped?.({ columnApi, api } as any);
    expect(localStorage.setItem).not.toHaveBeenCalled();

    // mark grid ready
    opts.onFirstDataRendered?.({ api } as any);

    // now calling drag stopped should save
    opts.onDragStopped?.({ columnApi, api } as any);
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('saves scroll position on body scroll end when gridReady', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const persist = new AgPersist('scroll-grid');
    const opts = persist.setup();

    // make grid ready
    opts.onFirstDataRendered?.({ api: { getModel: () => ({ getRowIndexAtPixel: () => 2 }) } } as any);

    const mockCol = (id: string, left: number) => ({ isPinned: () => false, isVisible: () => true, getLeft: () => left, getId: () => id });
    const colApi: any = { getAllDisplayedColumns: () => [ mockCol('c1', 0), mockCol('c2', 100) ] };

    const event: any = { columnApi: colApi, api: { getModel: () => ({ getRowIndexAtPixel: () => 2 }) }, top: 10, left: 0 };

    opts.onBodyScrollEnd?.(event);

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
