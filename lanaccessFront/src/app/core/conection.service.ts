import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { Connection } from './conection.model';



@Injectable()
export class ConectionService {

    HOST_URL = 'ws:/localhost:3012/';

    constructor() { }

    /* Crea la conexion con un webSocet a partir de @url.
        Si el flujo se pausa, el webSocket se mantendra abierto.
     */
    connect(url: string): Observable<Connection> {
        return webSocket({
            url: this.HOST_URL + url,
            deserializer: msg => msg
        }).pipe(
            map(msg => ({ image: URL.createObjectURL(msg.data), time: msg.timeStamp })),
            shareReplay(1)
        )
    };

}