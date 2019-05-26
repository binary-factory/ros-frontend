import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { ActivatedRoute } from '@angular/router';
import { ROSServiceService } from '../../../../../ros/shared/services/ros-service.service';
import { NbToastrService } from '@nebular/theme';
import { NGXLogger } from 'ngx-logger';
import { switchMap, map } from 'rxjs/operators';
import { ROSRequestResponseOptions } from '../../../../../ros/shared/models/request-response-options';
import { ROSClientService } from '../../../../../ros/shared/services/ros-client.service';

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
    private toastService: NbToastrService,
    private rosClientService: ROSClientService ) {

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
          return this.rosClientService.getParamObject(typeObj.typedefs);
        })
      ).subscribe((paramObj) => {
        this.paramData = paramObj;
      });
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
