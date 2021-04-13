import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { AppComponent } from './app.component';
import { Connection } from './core/conection.model';
import { ConectionService } from './core/conection.service';

class MockConectService {
  internal$ = new Subject<Connection>();

  connect(url: string): Observable<Connection> {
    return this.internal$.asObservable();
  }
}

describe('AppComponent', () => {

  let mockConectService: ConectionService;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ], providers: [
        { provide: ConectionService, useClass: MockConectService },
        {
          provide: DomSanitizer,
          useValue: {
            sanitize: (ctx: any, val: string) => val,
            bypassSecurityTrustUrl: (val: string) => val,
          },
        }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    mockConectService = TestBed.inject(ConectionService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('El componente se crea con exito.', () => {
    expect(component).toBeDefined();
  });

  describe('face$', () => {
    it('Si se emite un valor', (done) => {

      const testValue = { image: 'TEST', time: 1 };

      mockConectService['internal$'].next(testValue)
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const found = fixture.nativeElement.querySelectorAll('.container-face-item');
        expect(found.length).toBe(1);
        expect(found[0].querySelector('img').getAttribute('src')).toBe(testValue.image);
        done()
      });
    });

    it('Si se emite dos valores', (done) => {

      const testValue = [
        { image: 'A', time: 1 },
        { image: 'B', time: 1 }];

      testValue.forEach(x => mockConectService['internal$'].next(x));


      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const found: any[] = fixture.nativeElement.querySelectorAll('.container-face-item');
        expect(found.length).toBe(testValue.length);
        found.forEach((x, index) => {
          expect(x.querySelector('img').getAttribute('src')).toBe(testValue[index].image);
        })
        done()
      });
    })
  })


});
