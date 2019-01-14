import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';

@Component({
  selector: 'ros-viewer',
  templateUrl: './ros-viewer.component.html',
  styleUrls: ['./ros-viewer.component.scss']
})
export class RosViewerComponent implements OnInit, AfterViewInit {

  camera: THREE.Camera;

  scene: THREE.Scene;

  controls: THREE.OrbitControls;

  renderer: THREE.WebGLRenderer;

  isEnabled = false;

  animationId: number;

  @ViewChild('container')
  readonly container: ElementRef;

  constructor(private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, 16 / 9, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.controls = new OrbitControls(this.camera, this.container.nativeElement);
    this.controls.enabled = false;

    this.scene.add(new THREE.AmbientLight(0x555555));
  }

  ngAfterViewInit() {
    this.renderer2.appendChild(this.container.nativeElement, this.renderer.domElement);

    this.calculateSize();

    this.enable();
  }

  enable() {
    this.isEnabled = true;
    this.animate();
  }

  disable() {
    this.isEnabled = false;
    cancelAnimationFrame(this.animationId);
  }

  calculateSize() {
    const element = this.container.nativeElement;
    const computedStyle = getComputedStyle(element);
    let elementHeight = element.clientHeight;  // height with padding
    let elementWidth = element.clientWidth;   // width with padding

    elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

    this.controls.update();

    this.camera.aspect = elementWidth / elementHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(elementWidth, elementHeight);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.calculateSize();
  }

  animate() {
    if (this.isEnabled) {
      this.animationId = requestAnimationFrame(this.animate.bind(this));
      this.renderer.render(this.scene, this.camera);
    }
  }
}
