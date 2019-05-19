import {
  AfterViewInit,
  Component,
  ElementRef,
  EmbeddedViewRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import SimpleWebRTC from 'simplewebrtc';

@Component({
  selector: 'ngx-video',
  styleUrls: ['./video.component.scss'],
  templateUrl: './video.component.html'
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {

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

  isLocalReady = false;

  isRemoteReady = false;

  webRtc: SimpleWebRTC;

  videoIsPaused = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Prevents ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.setupRTCAudioVideoElement(this.localView.nativeElement, this.selectedCamera);
      this.addRemoteDummy();
    }, 0);

    this.webRtc = new SimpleWebRTC({
      url: 'https://robot:8443',
      localVideoEl: this.localVideoId,
      remoteVideosEl: 'remoteVideos',
      autoRemoveVideos: false,
      autoRequestMedia: true
    });

    this.webRtc.on('readyToCall', () => {
      this.webRtc.joinRoom('test');
    });

    this.webRtc.on('joinedRoom', () => {
      this.isLocalReady = true;
    });

    this.webRtc.on('leftRoom', () => {
      this.isLocalReady = false;
    });

    this.webRtc.on('videoAdded', (el: HTMLElement, peer) => {
      this.removeRemoteAudioVideoElements();
      this.setupRTCAudioVideoElement(el, this.remoteVideoName);
      this.isRemoteReady = true;
    });

    this.webRtc.on('peerStreamRemoved', () => {
      this.removeRemoteAudioVideoElements();
      this.addRemoteDummy();
      this.isRemoteReady = false;
    });

    this.webRtc.on('error', (err) => {
      console.log(err);
    });

    this.videoIsPaused = false;

  }

  ngOnDestroy() {
    this.webRtc.leaveRoom();
    this.webRtc.disconnect();
  }

  selectCamera(name: string) {
    this.isSingleView = true;
    this.selectedCamera = name;
  }

  private addRemoteDummy() {
    const view = this.template.createEmbeddedView({ id: this.remoteVideoName, name: this.remoteVideoName });
    this.cameraContainer.insert(view);
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
        this.cameraContainer.remove(i);
      }
    }
  }

  private toggleAudioVideoStream() {
    if (!this.videoIsPaused) {
      this.webRtc.pause();
      this.videoIsPaused = true;

    } else {
      this.webRtc.resume();
      this.videoIsPaused = false;
    }

  }
}
