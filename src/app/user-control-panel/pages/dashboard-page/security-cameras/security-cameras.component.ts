import { AfterViewInit, Component } from '@angular/core';
import SimpleWebRTC from 'simplewebrtc';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html'
})
export class SecurityCamerasComponent implements AfterViewInit {

  cameras: any[] = [{
    title: 'Gegenüber',
    source: 'assets/images/camera1.jpg'
  }, {
    title: 'Du',
    source: 'assets/images/camera2.jpg'
  }];

  selectedCamera: any = this.cameras[0];

  isSingleView = false;

  selectCamera(camera: any) {
    this.selectedCamera = camera;
    this.isSingleView = true;
  }

  ngAfterViewInit(): void {
    const webrtc = new SimpleWebRTC({
      url: 'http://192.168.0.10:8888',
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remoteVideos',
      // immediately ask for camera access
      autoRequestMedia: true
    });
    webrtc.on('readyToCall', () => {
      // you can name it anything
      webrtc.joinRoom('your awesome room name');
    });
    webrtc.startLocalVideo();
  }
}
