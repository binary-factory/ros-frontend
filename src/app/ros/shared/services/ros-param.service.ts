import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROSRequestResponseOptions } from '../models/request-response-options';
import { ROSClientService } from './ros-client.service';
import { ROSServiceService } from './ros-service.service';

@Injectable({
  providedIn: 'root'
})
export class ROSParamService {

  constructor(private _rosClient: ROSClientService, private rosServiceService: ROSServiceService) {
  }

  getParam(name: string, options?: ROSRequestResponseOptions) {
    const serviceArgs = {
      name
    };

    return this.rosServiceService
      .callService('/rosapi/get_param', 'rosapi/GetParam', serviceArgs, options)
      .pipe(map((response) => {
        if (response) {
          return response.value;
        } else {
          return response;
        }
      }));

  }

  setParam(name: string, value: any, options?: ROSRequestResponseOptions) {
    const serviceArgs = {
      name,
      value: JSON.stringify(value)
    };

    return this.rosServiceService
      .callService('/rosapi/set_param', 'rosapi/SetParam', serviceArgs, options)
      .pipe(map((response) => true));
  }

  deleteParam(name: string, options?: ROSRequestResponseOptions) {
    const serviceArgs = {
      name
    };

    return this.rosServiceService
      .callService('/rosapi/delete_param', 'rosapi/DeleteParam', serviceArgs, options)
      .pipe(map(response => true));
  }

  getParamNames(options?: ROSRequestResponseOptions) {
    const source = new Observable<string[]>((observer) => {
      this._rosClient.instance.getParams((params) => {
        observer.next(params);
        observer.complete();
      }, (err) => {
        observer.error(err);
      });
    });

    return this._rosClient.applyRequestResponseOptions(source, options);
  }

}
