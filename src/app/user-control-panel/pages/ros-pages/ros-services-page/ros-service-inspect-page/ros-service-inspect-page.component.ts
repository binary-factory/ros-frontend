import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { ActivatedRoute } from '@angular/router';
import { ROSServiceService } from '../../../../../ros/shared/services/ros-service.service';
import { NbToastrService } from '@nebular/theme';
import { NGXLogger } from 'ngx-logger';
import { switchMap, map } from 'rxjs/operators';
import { ROSRequestResponseOptions } from '../../../../../ros/shared/models/request-response-options';

@Component({
  selector: 'ngx-ros-service-inspect-page',
  templateUrl: './ros-service-inspect-page.component.html',
  styleUrls: ['./ros-service-inspect-page.component.scss']
})
export class RosServiceInspectPageComponent implements OnInit {

  name: string;

  type: string;

  editorOptionsParams: JsonEditorOptions;

  editorOptionsResult: JsonEditorOptions;

  paramData: any;

  paramDataSend: any;

  resultData: any;

  loading = false;

  constructor(private route: ActivatedRoute,
    private rosServiceService: ROSServiceService,
    private logger: NGXLogger,
    private toastService: NbToastrService) {

    this.editorOptionsParams = new JsonEditorOptions();
    this.editorOptionsResult = new JsonEditorOptions();
    this.editorOptionsParams.mode = 'code';
    this.editorOptionsResult.modes = ['code', 'view'];
    this.editorOptionsResult.mode = 'view';
  }


  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('id');
    this.rosServiceService
      .getServiceType(this.name)
      .pipe(
        switchMap((type) => {
          return this.rosServiceService.getServiceRequestDetails(type);
        }),
        map((typeObj) => {
          return this.getParamObject(typeObj);
        })
      ).subscribe((paramObj) => {
        this.paramData = paramObj;
      });
  }

  getParamObject(type: any) {
    const typeDict = this.getServiceTypeObject(type.typedefs);
    const iterate = (obj: any) => {
      for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] == 'object') {
            iterate(obj[property]);
          }
          else {
            let type: string;
            if (Array.isArray(obj[property])) {
              type = obj[property][0];
            } else {
              type = obj[property];
            }
            type = type.toLowerCase();

            let example: any = '';
            switch (type) {
              case 'string':
                example = '';
                break;
              case 'bool':
                example = false;
                break;
              case 'time':
                let date = new Date();
                example = date.toISOString();
                break;
              case 'byte':
              case 'int8':
              case 'int16':
              case 'int32':
              case 'int64':
              case 'uint8':
              case 'uint16':
              case 'uint32':
              case 'uint64':
                example = 0;
                break;
              case 'float32':
              case 'float64':
                example = 0.0;
                break;
            }

            if (Array.isArray(obj[property])) {
              obj[property][0] = example;
            } else {
              obj[property] = example;
            }
          }
        }
      }
    }
    iterate(typeDict);

    return typeDict;
  }

  getServiceTypeObject(defs: any) {
    const decodeTypeDefsRec = (theType, hints) => {
      const typeDefDict = {};
      for (let i = 0; i < theType.fieldnames.length; i++) {
        const arrayLen = theType.fieldarraylen[i];
        const fieldName = theType.fieldnames[i];
        const fieldType = theType.fieldtypes[i];
        if (fieldType.indexOf('/') === -1) {
          if (arrayLen === -1) {
            typeDefDict[fieldName] = fieldType;
          } else {
            typeDefDict[fieldName] = [fieldType];
          }
        } else {
          let sub = false;
          for (let j = 0; j < hints.length; j++) {
            if (hints[j].type.toString() === fieldType.toString()) {
              sub = hints[j];
              break;
            }
          }
          if (sub) {
            const subResult = decodeTypeDefsRec(sub, hints);
            if (arrayLen === -1) {
              typeDefDict[fieldName] = subResult;
            } else {
              typeDefDict[fieldName] = [subResult];
            }
          } else {
            this.logger.error(`Cannot find ${fieldType} in decodeTypeDefs`);
          }
        }
      }
      return typeDefDict;
    };

    return decodeTypeDefsRec(defs[0], defs);
  }

  getParamData(data: any) {
    this.paramDataSend = data;
  }

  callService() {
    const options: ROSRequestResponseOptions = {
      enqueue: false,
      timeout: 50000
    }
    this.loading = true;
    this.rosServiceService
      .callService(this.name, this.type, this.paramDataSend, options)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((result) => {
        this.toastService.success('', 'Erfolgreich!');
        this.resultData = result;
      }, (err) => {
        this.toastService.danger('Siehe Console-Log', 'Fehlgeschlagen!');
        this.logger.error(err);
      });
  }

}
