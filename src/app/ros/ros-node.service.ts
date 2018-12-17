import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ROSService } from './ros.service';
import { ROSNodeDetails } from './models/node-details.model';

@Injectable({
  providedIn: 'root'
})
export class ROSNodeService {

  constructor(private rosService: ROSService) { }

  get nodes() {
    return new Observable<string[]>((observer) => {
      this.rosService.instance.getNodes((nodes) => {
        observer.next(nodes);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getNodeDetails(name: string) {
    return new Observable<ROSNodeDetails>((observer) => {
      this.rosService.instance.getNodeDetails(name, (publications, subscriptions, services) => {
        const nodeDetails: ROSNodeDetails = {
          publications,
          subscriptions,
          services
        }
        observer.next(nodeDetails);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }
}
