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

  private webRtc = null;

  private videoIspaused: boolean = false;

  constructor() {
  }

  ngAfterViewInit() {
    // Prevents ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.setupRTCAudioVideoElement(this.localView.nativeElement, this.selectedCamera);
    }, 0);

    this.webRtc = new SimpleWebRTC({
      url: 'http://192.168.0.10:8888',
      localVideoEl: this.localVideoId,
      remoteVideosEl: 'remoteVideos',
      autoRemoveVideos: false,
      autoRequestMedia: true
    });
    this.webRtc.on('readyToCall', () => {
      this.removeRemoteAudioVideoElements();
      this.webRtc.joinRoom('test');
    });

    this.webRtc.on('videoAdded', (el: HTMLElement, peer) => {
      this.setupRTCAudioVideoElement(el, this.remoteVideoName);
    });

    this.webRtc.on('peerStreamRemoved', (peer) => {
      this.removeRemoteAudioVideoElements(peer);
    });

    this.webRtc.on('error', (err) => {
      console.log(err);
    });

    this.videoIspaused = false;

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

  private stopVideo() {
    if (!this.videoIspaused) {
      console.log(this.videoIspaused);
      this.webRtc.pause();
      this.videoIspaused = true;

    } else {
      console.log(this.videoIspaused);
      this.webRtc.resume();
      this.videoIspaused = false;
    }

  }
}
