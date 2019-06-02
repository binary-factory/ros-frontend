import { Component, AfterViewInit } from '@angular/core';
import { NbSpinnerService } from '@nebular/theme';

import SimpleWebRTC from 'simplewebrtc';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngx-tpr-video-page',
  templateUrl: './tpr-video-page.component.html',
  styleUrls: ['./tpr-video-page.component.scss']
})
export class TprVideoPageComponent implements AfterViewInit {

  webRtc: SimpleWebRTC;

  constructor(private spinnerService: NbSpinnerService) { }

  ngAfterViewInit() {
    (this.spinnerService as any).hideSpinner();
    this.webRtc = new SimpleWebRTC({
      url: environment.webrtc.url,
      localVideoEl: 'localVideo',
      remoteVideosEl: 'remoteVideos',
      autoRemoveVideos: true,
      autoRequestMedia: true,
      media: environment.webrtc.media
    });

    this.webRtc.on('readyToCall', () => {
      console.log('hier gehts ab')
      this.webRtc.joinRoom('test');
    });

    this.webRtc.on('joinedRoom', () => {
      console.log('ready');
    });

    this.webRtc.on('leftRoom', () => {

    });
  }

}
