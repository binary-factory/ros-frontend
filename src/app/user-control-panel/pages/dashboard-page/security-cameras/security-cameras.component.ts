import { AfterViewInit, Component, ElementRef, EmbeddedViewRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import SimpleWebRTC from 'simplewebrtc';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html'
})
export class SecurityCamerasComponent implements AfterViewInit {

  readonly localVideoId = 'localVideo';

  readonly localVideoName = 'Du';

  readonly remoteVideoName = 'Gegenüber';

  @ViewChild('localVideo', { read: ElementRef })
  localView: ElementRef;

  @ViewChild('cameraContainer', { read: ViewContainerRef })
  cameraContainer: ViewContainerRef;

  @ViewChild('template', { read: TemplateRef })
  template: TemplateRef<any>;

  selectedCamera = this.localVideoName;

  isSingleView = false;

  constructor() {
  }

  ngAfterViewInit() {
    // Prevents ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.setupRTCAudioVideoElement(this.localView.nativeElement, this.selectedCamera);
    }, 0);

    const webRtc = new SimpleWebRTC({
      url: 'http://192.168.0.10:8888',
      localVideoEl: this.localVideoId,
      remoteVideosEl: 'remoteVideos',
      autoRemoveVideos: false,
      autoRequestMedia: true
    });

    webRtc.on('readyToCall', () => {
      this.removeRemoteAudioVideoElements();
      webRtc.joinRoom('test');
    });

    webRtc.on('videoAdded', (el: HTMLElement, peer) => {
      this.setupRTCAudioVideoElement(el, this.remoteVideoName);
    });

    webRtc.on('peerStreamRemoved', (peer) => {
      this.removeRemoteAudioVideoElements(peer);
    });

    webRtc.on('error', (err) => {
      console.log(err);
    });
  }

  selectCamera(name: string) {
    this.isSingleView = true;
    this.selectedCamera = name;
  }

  private setupRTCAudioVideoElement(audioVideo: HTMLElement, name) {
    audioVideo.parentElement.removeChild(audioVideo);

    const id = audioVideo.getAttribute('id'); // Use peer!
    const view = this.template.createEmbeddedView({ id, name });
    this.cameraContainer.insert(view);
    const root = view.rootNodes[0] as HTMLElement;
    root.insertBefore(audioVideo, root.firstChild);
  }

  private removeRemoteAudioVideoElements(peer?) {
    for (let i = 0; i < this.cameraContainer.length; i++) {
      const view = this.cameraContainer.get(i) as EmbeddedViewRef<any>;
      if (peer) {
        if (view.context.id.startsWith(peer.id)) {
          this.cameraContainer.remove(i);
        }
      } else if (view.context.id !== this.localVideoId) {
        console.log(view.context.id);
        this.cameraContainer.remove(i);
      }
    }
  }
}
