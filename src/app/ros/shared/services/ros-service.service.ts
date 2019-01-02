import { Injectable } from '@angular/core';
import { Service, ServiceRequest } from 'roslib';
import { Observable } from 'rxjs';
import { ROSRequestOptions } from '../models/request-options';
import { ROSDefaultRequestResponseOptions, ROSRequestResponseOptions } from '../models/request-response-options';
import { ROSClientService } from './ros-client.service';

@Injectable({
  providedIn: 'root'
})
export class ROSServiceService {

  constructor(private _rosClient: ROSClientService) {
  }

  callService(name: string, type: string, args: any, options?: ROSRequestResponseOptions) {
    options = Object.assign(options || {}, ROSDefaultRequestResponseOptions);

    const serviceOptions = {
      ros: this._rosClient.instance,
      name,
      serviceType: type
    };

    const service = new Service(serviceOptions);
    const serviceRequest = new ServiceRequest(args);

    const source = new Observable<any>((observer) => {
      service.callService(serviceRequest, (response) => {
        observer.next(response);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }

  registerService(name: string, type: string, options?: ROSRequestOptions) {
    const serviceOptions = {
      ros: this._rosClient.instance,
      name,
      serviceType: type
    };

    const service = new Service(serviceOptions);
    const source = new Observable<any>((observer) => {
      service.advertise((request, response) => {
        observer.next({ request, response });
        observer.complete();
      });

      return () => {
        service.unadvertise();
      };
    });

    return this._rosClient.applyRequestOptions(source, options);
  }

  getServiceNames(options?: ROSRequestResponseOptions) {
    const source = new Observable<string[]>((observer) => {
      this._rosClient.instance.getServices((services) => {
        observer.next(services);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }
}
