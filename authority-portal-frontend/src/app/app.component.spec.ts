import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {AppComponent} from './app.component';
import {ApiService} from './services/api.service';
import {Spied, provideSpy} from './utils/jasmine-utils';

describe('AppComponent', () => {
  let apiService: Spied<ApiService>;

  beforeEach(() => {
    apiService = jasmine.createSpyObj('ApiService', ['exampleDbQuery']);
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [provideSpy(ApiService, apiService)],
    });
    apiService.exampleDbQuery.and.returnValue(of(['1', '2', '3']));
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('app');
  });
});
