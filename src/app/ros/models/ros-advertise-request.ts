import { ROSMessage } from './ros-message';

export interface ROSAdvertiseMessage extends ROSMessage {
    topic: string;
    type: string;
}