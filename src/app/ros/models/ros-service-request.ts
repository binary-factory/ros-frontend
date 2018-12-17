import { ROSMessage } from './ros-message';
import { ROSCompression } from './common';

export interface ROSServiceRequest extends ROSMessage {
    service: string;
    args?: any[];
    fragment_size?: number;
    compression: ROSCompression;
}