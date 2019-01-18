import { ConnectionPositionPair, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { RosPointCloudComponent, RosPointCloudOptions } from '../../../../ros/shared/components/ros-point-cloud/ros-point-cloud.component';
import { PointCloudSettingsComponent } from '../point-cloud-settings/point-cloud-settings.component';

@Component({
  selector: 'ngx-point-cloud',
  templateUrl: './point-cloud.component.html',
  styleUrls: ['./point-cloud.component.scss']
})
export class PointCloudComponent implements OnInit, AfterViewInit {

  overlayRef: OverlayRef;

  overlayPosition: PositionStrategy;

  formComponentPortal: ComponentPortal<PointCloudSettingsComponent>;

  @ViewChild(RosPointCloudComponent)
  pointCloud: RosPointCloudComponent;

  @ViewChild(RosPointCloudComponent, { read: ElementRef })
  buttonRef: ElementRef;

  isSettingsVisible = false;

  options: RosPointCloudOptions = {
    topic: {
      name: '/rtabmap/cloud_map',
      messageType: 'sensor_msgs/PointCloud2',
      compression: 'cbor'
    },
    material: {
      vertexColors: THREE.VertexColors,
      size: 0.1
    },
    isColorful: true
  };

  constructor(public overlay: Overlay, public elementRef: ElementRef) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.options.material.size = 0.2;
      this.pointCloud.refreshScene();
    }, 2500);
  }

  ngAfterViewInit() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.getOverlayPosition(),
      width: 200,
      hasBackdrop: true,
      backdropClass: 'hidden',
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef
      .backdropClick()
      .subscribe(() => {
        this.overlayRef.detach();
        this.isSettingsVisible = false;
      });

    this.formComponentPortal = new ComponentPortal(PointCloudSettingsComponent);
  }

  toggleDialog() {
    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.formComponentPortal);
      this.isSettingsVisible = true;
    } else {
      this.overlayRef.detach();
      this.isSettingsVisible = false;
    }
  }

  getOverlayPosition(): PositionStrategy {
    this.overlayPosition = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        new ConnectionPositionPair({ originX: 'center', originY: 'center' }, { overlayX: 'center', overlayY: 'center' })
      ]);

    return this.overlayPosition;
  }

}
