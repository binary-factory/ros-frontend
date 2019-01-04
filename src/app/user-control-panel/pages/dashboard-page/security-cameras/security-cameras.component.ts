import { Component } from '@angular/core';

@Component({
  selector: 'ngx-security-cameras',
  styleUrls: ['./security-cameras.component.scss'],
  templateUrl: './security-cameras.component.html'
})
export class SecurityCamerasComponent {

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
}
