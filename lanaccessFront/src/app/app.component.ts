import { Component } from '@angular/core';
import { map, repeatWhen, scan, takeUntil } from "rxjs/operators";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConectionService } from './core/conection.service';
import { Observable, Subject } from 'rxjs';
import { ConnectionMapped } from './core/conection.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'lanaccessFront';

  stop$ = new Subject();
  play$ = new Subject();

  constructor(private conectService: ConectionService, private sanitizer: DomSanitizer) { }

  /* Flujo encargado de gestionar el video, remplaza la imagen anterior con la nueva. 
    Es posible pausar y reanudar el flujo. 
  */
  video$: Observable<SafeUrl> = this.conectService.connect('video').pipe(
    map(blob => this.sanitizer.bypassSecurityTrustUrl(blob.image)),
    takeUntil(this.stop$),
    repeatWhen(() => this.play$)
  );

  /* Flujo encargado de gestionar el listado de 'faces',
    conforme llegan las nuevas imagenes se van acumulando en el flujo*/
  face$: Observable<ConnectionMapped[]> = this.conectService.connect('face').pipe(
    map(blob => (
      {
        image: this.sanitizer.bypassSecurityTrustUrl(blob.image),
        time: blob.time
      })),
    scan((acc, curr) => { acc.push(curr); return acc }, [])
  );

  ngOnInit(): void {

  }
}
