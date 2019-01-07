import {
  AfterViewInit,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import SimpleWebRTC from 'simplewebrtc';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html'
})
export class SecurityCamerasComponent implements AfterViewInit {

  @ViewChild('localVideo', { read: ElementRef })
  localView: ElementRef;

  @ViewChild('cameraContainer', { read: ViewContainerRef })
  cameraContainer: ViewContainerRef;

  @ViewChild('template', { read: TemplateRef })
  template: TemplateRef<any>;

  selectedCamera: string;

  isSingleView = false;

  constructor() {
  }

  ngAfterViewInit() {
    // Prevents ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.setupRTCAudioVideoElement(this.localView.nativeElement, 'Du');
    }, 0);

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
      this.setupRTCAudioVideoElement(el, 'Gegenüber');
    });
  }

  selectCamera(name: string) {
    this.isSingleView = true;
    this.selectedCamera = name;
  }

  private setupRTCAudioVideoElement(audioVideo: HTMLElement, name) {
    audioVideo.parentElement.removeChild(audioVideo);

    const view = this.template.createEmbeddedView({ name });

    this.cameraContainer.insert(view);
    const root = view.rootNodes[0] as HTMLElement;
    root.insertBefore(audioVideo, root.firstChild);
  }
}
