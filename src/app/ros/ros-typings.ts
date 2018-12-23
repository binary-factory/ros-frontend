import 'roslib';

declare module 'roslib' {
  export interface Ros {

    getNodeDetails(name: string, callback: (publications: string[], subscriptions: string[], services: string[]) => void, failedCallback?: (error: any) => void): void

  }
}
