import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import './three-extended-typings';


@Component({
  selector: 'ngx-point-cloud',
  templateUrl: './point-cloud.component.html',
  styleUrls: ['./point-cloud.component.scss']
})
export class PointCloudComponent implements OnInit, AfterViewInit {

  isEnabled = false;

  readonly arrowKeys = {37: 1, 38: 1, 39: 1, 40: 1};

  private _scene: THREE.Scene;

  private _camera: THREE.Camera;

  private _renderer: THREE.WebGLRenderer;

  private _cube: THREE.Mesh;

  private _controls: THREE.OrbitControls;

  @ViewChild('container', {read: ElementRef})
  private _container: ElementRef;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2,
              @Inject(DOCUMENT) private document) {
  }

  ngOnInit() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(90, 16 / 9, 0.1, 1000);
    this._renderer = new THREE.WebGLRenderer();
    this._controls = new OrbitControls(this._camera);
  }

  ngAfterViewInit() {
    this.renderer.appendChild(this._container.nativeElement, this._renderer.domElement);

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this._scene.add(gridHelper);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    this._cube = new THREE.Mesh(geometry, material);
    this._scene.add(this._cube);

    this._camera.position.z = 5;

    this._controls.keyPanSpeed = 25;

    this.onResize(null);

    this.animate();

    this._controls.enabled = this.isEnabled;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const element = this._container.nativeElement;
    const computedStyle = getComputedStyle(element);
    let elementHeight = element.clientHeight;  // height with padding
    let elementWidth = element.clientWidth;   // width with padding

    elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);

    this._controls.update();

    this._camera.aspect = elementWidth / elementHeight;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(elementWidth, elementHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this._renderer.render(this._scene, this._camera);
  }

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }

    e.returnValue = false;
  }

  preventDefaultForScrollKeys(e) {
    console.log(e.key);
    if (this.arrowKeys[e.keyCode]) {
      this.preventDefault(e);
      return false;
    }
  }

  disableScroll() {
    if (window.addEventListener) {
      window.addEventListener('DOMMouseScroll', this.preventDefault.bind(this), false);
    }
    window.onwheel = this.preventDefault.bind(this); // modern standard
    window.onmousewheel = this.document.onmousewheel = this.preventDefault.bind(this); // older browsers, IE
    window.ontouchmove = this.preventDefault.bind(this); // mobile
    this.document.onkeydown = this.preventDefaultForScrollKeys.bind(this);
  }

  enableScroll() {
    if (window.removeEventListener) {
      window.removeEventListener('DOMMouseScroll', this.preventDefault.bind(this), false);
    }
    window.onmousewheel = this.document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    this.document.onkeydown = null;
  }

  toggleEnable() {
    this.isEnabled = !this.isEnabled;
    this._controls.enabled = this.isEnabled;
    if (this.isEnabled) {
      this.disableScroll();
    } else {
      this.enableScroll();
    }
  }
}
