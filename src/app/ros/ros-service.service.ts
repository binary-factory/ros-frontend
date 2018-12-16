import { Injectable } from '@angular/core';
import { ROSService } from './ros.service';
import { ServiceRequest, Service, ServiceResponse } from 'roslib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ROSServiceService {

  constructor(private rosService: ROSService) { }

  call(options: {
    name: string,
    serviceType: string,
    values?: any
  }) {
    const request = new ServiceRequest(options.values);
    const service = new Service(Object.assign(options, { ros: this.rosService.instance }));
    
    return new Observable<ServiceResponse | any>((observer) => {
      service.callService(request, (response) => {
        observer.next(response);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  get services() {
    return new Observable<string[]>((observer) => {
      this.rosService.instance.getServices((services) => {
        observer.next(services);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }
}
