import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ROSNodeService } from '../../../../../ros/shared/services/ros-node.service';
import { ROSTopicService, RosTopicOptions } from '../../../../../ros/shared/services/ros-topic.service';
import { Observable, Subscription } from 'rxjs';
import { concatMap, mergeMap, reduce, finalize, tap, switchMap, map } from 'rxjs/operators';
import { JsonEditorOptions } from 'ang-jsoneditor';
import { ROSClientService } from '../../../../../ros/shared/services/ros-client.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-ros-topic-inspect-page',
  templateUrl: './ros-topic-inspect-page.component.html',
  styleUrls: ['./ros-topic-inspect-page.component.scss']
})
export class RosTopicInspectPageComponent implements OnInit {

  name: string;

  type: string;

  subscribingNodes: string[] = [];

  publishingNodes: string[] = [];

  pubEditorOptions: JsonEditorOptions;

  subEditorOptions: JsonEditorOptions;

  isSending = false;

  sendingError: any;

  isSubscribed = false;

  loading = true;

  pubData: any;

  subData: any;

  pubDataSend: any;

  topic: any;

  sub: Subscription;



  constructor(private route: ActivatedRoute,
    private rosNodeService: ROSNodeService,
    private rosTopicService: ROSTopicService,
    private rosClientService: ROSClientService,
    private toastService: NbToastrService) {

  }

  ngOnInit() {
    this.pubEditorOptions = new JsonEditorOptions();
    this.subEditorOptions = new JsonEditorOptions();

    this.pubEditorOptions.modes = ['code', 'view'];
    this.pubEditorOptions.mode = 'code';

    this.subEditorOptions.modes = ['code', 'view'];
    this.subEditorOptions.mode = 'view';

    this.name = this.route.snapshot.paramMap.get('id');

    this.rosNodeService
      .getNodes()
      .pipe(
        concatMap(_ => _),
        mergeMap((nodeName: string) => {
          return this.rosNodeService.getNodeDetails(nodeName);
        }),
        reduce<any, any[]>((array, value) => {
          array.push(value);
          return array;
        }, []),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe((nodeDetailsArray) => {
        const subscribingNodes = [];
        const publishingNodes = [];

        for (const nodeDetails of nodeDetailsArray) {
          if ((subscribingNodes.indexOf(this.name) === -1)
            && ((nodeDetails.subscriptions as string[]).indexOf(this.name) > -1)) {

            subscribingNodes.push(nodeDetails.name);
          }

          if ((publishingNodes.indexOf(this.name) === -1)
            && ((nodeDetails.publications as string[]).indexOf(this.name) > -1)) {

            publishingNodes.push(nodeDetails.name);
          }
        }

        this.subscribingNodes = subscribingNodes;
        this.publishingNodes = publishingNodes;
      });


    this.rosTopicService
      .getTopicType(this.name)
      .pipe(
        tap((type) => {
          const options: RosTopicOptions = {
            name: this.name,
            messageType: this.type
          }
          this.type = type;
          this.topic = this.rosTopicService.createTopicSubject(options);
        }),
        switchMap((type) => {
          return this.rosTopicService.getTopicTypeDef(type);
        }),
        map((typeDef) => {
          return this.rosClientService.getParamObject(typeDef);
        })
      ).subscribe((pubData) => {
        this.pubData = pubData;
      })
  }

  sendMessage() {
    this.topic.next(this.pubDataSend);
  }

  unsubscribe() {
    if(this.sub){
      this.sub.unsubscribe();
      console.log('fin')
      this.sub = null;
    }
  }

  subunsub() {
    if (this.sub) {
      this.unsubscribe();
    } else {
      this.sub = this.topic.pipe(finalize(() => {
        this.unsubscribe();
      })).subscribe((subData) => {
        this.subData = subData;
      },(err: string) =>{
        this.toastService.danger(err,'Fehler!');
        this.unsubscribe();
      });
    }


  }

  getPubData(pubData: any) {
    this.pubDataSend = pubData;
  }

}
