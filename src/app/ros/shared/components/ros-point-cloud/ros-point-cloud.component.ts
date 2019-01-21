import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Subject, Subscription } from 'rxjs';
import { filter, mergeMap, retryWhen, take, tap } from 'rxjs/operators';
import * as THREE from 'three';
import { PointsMaterialParameters } from 'three';
import { ROSClientService } from '../../services/ros-client.service';
import { RosTopicOptions, ROSTopicService } from '../../services/ros-topic.service';
import { RosViewerComponent } from '../ros-viewer/ros-viewer.component';

export interface RosPointCloudOptions {
  topic: RosTopicOptions;
  material: PointsMaterialParameters;
  isColorful: boolean;
}

const RosPointCloudOptionsDefaults: RosPointCloudOptions = {
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

@Component({
  selector: 'ros-point-cloud',
  templateUrl: './ros-point-cloud.component.html',
  styleUrls: ['./ros-point-cloud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RosPointCloudComponent implements OnInit, AfterViewInit, OnDestroy {
  decode64Lookup: any;

  @Output()
  drawn: EventEmitter<{}> = new EventEmitter<{}>();

  @ViewChild(RosViewerComponent)
  viewerComponent: RosViewerComponent;

  mapTopic: Subject<any>;

  mapTopicSub: Subscription;

  pointsPosition: THREE.BufferAttribute;

  pointsColor: THREE.BufferAttribute;

  points: THREE.Points;

  isReady = false;

  constructor(private rosTopicService: ROSTopicService,
              private rosClientService: ROSClientService,
              private logger: NGXLogger) {

    const initVector = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    this.decode64Lookup = {};
    for (let i = 0; i < 64; i++) {
      this.decode64Lookup[initVector.charAt(i)] = i;
    }
  }

  private _options: RosPointCloudOptions = RosPointCloudOptionsDefaults;

  get options(): RosPointCloudOptions {
    return this._options;
  }

  @Input()
  set options(value: RosPointCloudOptions) {
    this._options = value;

    if (!this.options.isColorful) {
      this.pointsColor = null;
    }

    if (this.isReady) {
      this.refreshScene();
    }
  }

  ngOnInit() {
    this.mapTopic = this.rosTopicService.createTopicSubject(this.options.topic);
  }

  ngAfterViewInit() {
    this.isReady = true;
    this.prepareScene();
    this.viewerComponent.camera.position.z = 5;

    this.subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  subscribe() {
    this.mapTopicSub = this.mapTopic
      .pipe(
        retryWhen((errors) => {
          return errors.pipe(
            tap((error) => {
              this.onTopicError(error);
            }),
            take(1),
            mergeMap(() => {
              return this.rosClientService.connected$;
            }),
            filter((connected) => {
              return connected === true;
            }),
            tap((connected) => {
              this.logger.trace('Connected! Retry!');
            })
          );
        })
      )
      .subscribe(this.onTopicMessage.bind(this), this.onTopicError.bind(this));
  }

  unsubscribe() {
    if (this.mapTopicSub) {
      this.mapTopicSub.unsubscribe();
      this.mapTopicSub = null;
    }
  }

  createScene() {
    if (!this.pointsPosition) {
      return;
    }

    const material = new THREE.PointsMaterial(this.options.material);
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', this.pointsPosition.setDynamic(true));
    if (this.pointsColor) {
      geometry.addAttribute('color', this.pointsColor.setDynamic(true));
    }

    if (this.points) {
      this.viewerComponent.scene.remove(this.points);
    }
    this.points = new THREE.Points(geometry, material);
    this.viewerComponent.scene.add(this.points);

    this.drawn.emit();
  }

  clearScene() {
    const scene = this.viewerComponent.scene;
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }

  refreshScene() {
    this.logger.info('refreshScene');
    this.clearScene();
    this.prepareScene();
    this.createScene();
  }

  private prepareScene() {
    this.viewerComponent.scene.add(new THREE.AmbientLight(0x555555));
    const gridHelper = new THREE.GridHelper(100, 100);
    this.viewerComponent.scene.add(gridHelper);
    this.viewerComponent.controls.enabled = true;
  }

  private onTopicMessage(message: any) {
    this.logger.info('Got map data!');
    const pointCount = message.height * message.row_step / message.point_step;
    const pointBytes = pointCount * message.point_step;
    const pointRatio = 1;

    const buffer = new Uint8Array(pointBytes / pointRatio);
    const n = this.decode64(message.data, buffer, message.point_step, pointRatio);

    const fields = message.fields.reduce((map, obj) => {
      map[obj.name] = obj;
      return map;
    }, {});

    this.pointsPosition = new THREE.BufferAttribute(new Float32Array(n * 3), 3, false);
    if (this.options.isColorful) {
      this.pointsColor = new THREE.BufferAttribute(new Float32Array(n * 3), 3, false);
    }

    const dataView = new DataView(buffer.buffer);
    const littleEndian = !message.is_bigendian;
    const xOffset = fields.x.offset;
    const yOffset = fields.y.offset;
    const zOffset = fields.z.offset;
    const colorOffset = fields.rgb.offset;
    let base;
    for (let i = 0; i < n; i++) {
      base = i * message.point_step;

      // Position.
      const x = dataView.getFloat32(base + xOffset, littleEndian);
      const y = dataView.getFloat32(base + yOffset, littleEndian);
      const z = dataView.getFloat32(base + zOffset, littleEndian);
      this.pointsPosition.setXYZ(i, y, z, x);

      // Color.
      if (this.options.isColorful) {
        const color = dataView.getFloat32(base + colorOffset, littleEndian);
        const colorArray = new Float32Array(1);
        colorArray[0] = color;
        const colorBytes = new Uint8Array(colorArray.buffer);
        const red = colorBytes[2] / 255;
        const green = colorBytes[1] / 255;
        const blue = colorBytes[0] / 255;
        this.pointsColor.setXYZ(i, red, green, blue);
      }
    }

    this.refreshScene();
  }

  private onTopicError(error: Error) {
    this.logger.error(error);
    this.drawn.error(error);
  }

  private decode64(inbytes, outbytes, record_size, pointRatio) {
    let x, b = 0, l = 0, j = 0;
    const L = inbytes.length, A = outbytes.length;
    record_size = record_size || A; // default copies everything (no skipping)
    pointRatio = pointRatio || 1; // default copies everything (no skipping)
    const bitSkip = (pointRatio - 1) * record_size * 8;
    for (x = 0; x < L && j < A; x++) {
      b = (b << 6) + this.decode64Lookup[inbytes.charAt(x)];
      l += 6;
      if (l >= 8) {
        l -= 8;
        outbytes[j++] = (b >>> l) & 0xff;
        if ((j % record_size) === 0) { // skip records
          x += bitSkip;
          l = l % 8;

          if (l > 0) {
            b = this.decode64Lookup[inbytes.charAt(x)];
          }
        }
      }
    }
    return Math.floor(j / record_size);
  }
}
