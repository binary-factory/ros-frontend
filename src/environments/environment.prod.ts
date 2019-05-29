/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  rosbridgeUrl: 'wss://robot:9090',
  webRTCUrl: 'https://robot:8443',
  controller: {
    fpsPolling: 5,
    speedAngular: 1,
    speedLinear: 1,
    deadZoneX: 0.2,
    deadZoneY: 0.2,
    topic: {
      name: '/robot0/cmd_vel',
      messageType: 'geometry_msgs/Twist'
    }
  },
  batteryTopic12v: {
    name: '/12V/battery_lvl',
    messageType: 'std_msgs/UInt8'
  },
  batteryTopic24v: {
    name: '/24V/battery_lvl',
    messageType: 'std_msgs/UInt8'
  },
  sensorObstacleTopic: {
    name: '/robot0/obstacles',
    messageType: 'std_msgs/UInt16MultiArray'
  },
  sensorDisableTopic: {
    name: '/robot0/deactivate_sensor',
    messageType: 'std_msgs/UInt16MultiArray'
  }
};
