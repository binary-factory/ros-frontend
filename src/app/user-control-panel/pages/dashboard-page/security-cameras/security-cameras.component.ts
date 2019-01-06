import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import SimpleWebRTC from 'simplewebrtc';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html'
})
export class SecurityCamerasComponent implements AfterViewInit {

  @ViewChild('camera_container')
  cameraContainer: ElementRef;

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
      localVideoEl: 'localVideo',
      remoteVideosEl: 'remoteVideos',
      autoRequestMedia: true
    });

    webrtc.on('readyToCall', () => {
      webrtc.joinRoom('test');
    });

    webrtc.on('videoAdded', (el: HTMLElement) => {
      console.log(this.cameraContainer);
      console.log(el);
      this.cameraContainer.nativeElement.appendChild(el);
    });
  }
}
