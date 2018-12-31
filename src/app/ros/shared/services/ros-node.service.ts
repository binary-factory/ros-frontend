import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ROSNodeDetails } from '../models/node-details.model';
import { ROSRequestResponseOptions } from '../models/request-response-options';
import { ROSClientService } from './ros-client.service';

@Injectable({
  providedIn: 'root'
})
export class ROSNodeService {

  constructor(private _rosClient: ROSClientService) {
  }

  getNodes(options?: ROSRequestResponseOptions) {
    const source = new Observable<string[]>((observer) => {
      this._rosClient.instance.getNodes((nodes) => {
        observer.next(nodes);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }

  getNodeDetails(name: string, options?: ROSRequestResponseOptions) {
    const source = new Observable<ROSNodeDetails>((observer) => {
      this._rosClient.instance.getNodeDetails(name, (publications, subscriptions, services) => {
        const nodeDetails: ROSNodeDetails = {
          publications,
          subscriptions,
          services
        };
        observer.next(nodeDetails);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }
}
