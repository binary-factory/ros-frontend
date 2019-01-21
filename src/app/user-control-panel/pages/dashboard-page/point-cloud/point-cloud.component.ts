import { ConnectionPositionPair, Overlay, OverlayRef, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { RosPointCloudComponent, RosPointCloudOptions } from '../../../../ros/shared/components/ros-point-cloud/ros-point-cloud.component';
import { PointCloudSettingsComponent, PointCloudSettingsData } from '../point-cloud-settings/point-cloud-settings.component';

export interface PointCloudSettings {
  isColorful: boolean;
  pointSize: number;
  pointLimit: number;
  pointShape: 'round' | 'square';
}

const PointCloudSettingsDefaults: PointCloudSettings = {
  isColorful: true,
  pointSize: 0.1,
  pointLimit: 10000,
  pointShape: 'round'
};

@Component({
  selector: 'ngx-point-cloud',
  templateUrl: './point-cloud.component.html',
  styleUrls: ['./point-cloud.component.scss']
})
export class PointCloudComponent implements OnInit, AfterViewInit {

  overlayRef: OverlayRef;

  overlayPosition: PositionStrategy;

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
      size: PointCloudSettingsDefaults.pointSize
    },
    isColorful: PointCloudSettingsDefaults.isColorful
  };

  settingsData: PointCloudSettings = PointCloudSettingsDefaults;

  constructor(public overlay: Overlay,
              public elementRef: ElementRef,
              public injector: Injector) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.overlayRef = this.overlay.create({
      positionStrategy: this.getOverlayPosition(),
      width: 300,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.reposition({ autoClose: true })
    });

    this.overlayRef
      .backdropClick()
      .subscribe(() => {
        this.overlayRef.detach();
      });

    this.overlayRef
      .attachments()
      .subscribe(() => {
        this.isSettingsVisible = true;
      });


    this.overlayRef
      .detachments()
      .subscribe(() => {
        this.isSettingsVisible = false;
      });
  }

  toggleDialog() {
    if (!this.overlayRef.hasAttached()) {
      const formComponentPortal = new ComponentPortal(PointCloudSettingsComponent, null, this.createOverlayInjector());
      const component = this.overlayRef.attach(formComponentPortal);

      component.instance.form.ngSubmit.subscribe(() => {
        const settings = component.instance.form.value as PointCloudSettings;
        this.settingsData = settings;
        this.overlayRef.detach();
        this.applySettings(settings);
      });
    } else {
      this.overlayRef.detach();
    }
  }

  applySettings(settings: PointCloudSettings) {
    const newOptions = Object.assign({}, this.options) as RosPointCloudOptions;
    newOptions.material = { vertexColors: THREE.VertexColors };
    newOptions.isColorful = settings.isColorful;
    newOptions.material.size = settings.pointSize;
    if (settings.pointShape === 'round') {
      const sprite = new THREE.TextureLoader().load('assets/images/disc.png');
      newOptions.material = Object.assign(newOptions.material, {
        map: sprite,
        alphaTest: 0.8,
        transparent: true
      });
    }
    // TODO: If from no color to colorfulk refresh map because we need new data old is deleted due memory savings.
    this.options = newOptions;
    this.refresh();
  }

  refresh() {
    this.pointCloud.unsubscribe();
    this.pointCloud.subscribe();
  }

  private getOverlayPosition(): PositionStrategy {
    this.overlayPosition = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        new ConnectionPositionPair({
          originX: 'center',
          originY: 'center'
        }, {
          overlayX: 'center',
          overlayY: 'center'
        })
      ])
      .withPush(false);

    return this.overlayPosition;
  }

  private createOverlayInjector() {
    const injectorTokens = new WeakMap();
    injectorTokens.set(PointCloudSettingsData, this.settingsData);
    return new PortalInjector(this.injector, injectorTokens);
  }
}
