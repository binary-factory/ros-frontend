import { ROSRequestOptions } from './request-options';

export interface ROSRequestResponseOptions extends ROSRequestOptions {
  timeout: number;
}

export const ROSDefaultRequestResponseOptions: ROSRequestResponseOptions = {
  enqueue: false,
  timeout: 5000
};
