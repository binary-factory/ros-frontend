import { Injectable } from '@angular/core';
import { ROSServiceService } from './ros-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ROSService } from './ros.service';

@Injectable({
  providedIn: 'root'
})
export class ROSParamService {

  constructor(private rosService: ROSService, private rosServiceService: ROSServiceService) { }

  get(name: string) {
    const serviceArgs = {
      name
    };

    return this.rosServiceService.call({
      name: '/rosapi/get_param',
      serviceType: 'rosapi/GetParam',
      values: serviceArgs
    }).pipe(map(response => {
      if (response) {
        return response.value;
      } else {
        return response;
      }
    }));
  }

  set(name: string, value: any) {
    const serviceArgs = {
      name,
      value: JSON.stringify(value)
    };

    return this.rosServiceService.call({
      name: '/rosapi/set_param',
      serviceType: 'rosapi/SetParam',
      values: serviceArgs
    }).pipe(map(response => true));
  }

  delete(name: string) {
    const serviceArgs = {
      name
    };

    return this.rosServiceService.call({
      name: '/rosapi/delete_param',
      serviceType: 'rosapi/DeleteParam',
      values: serviceArgs
    }).pipe(map(response => true));
  }

  get params() {
    return new Observable<string[]>((observer) => {
      this.rosService.instance.getParams((params) => {
        observer.next(params);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });
  }

}
