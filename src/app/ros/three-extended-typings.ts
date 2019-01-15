import 'three';

declare module 'three/three-core' {
  export interface Camera {
    aspect: number;

    updateProjectionMatrix(): void;
  }
}
