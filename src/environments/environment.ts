/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  rosbridgeUrl: 'wss://virtualbox:9090',
  webrtc: {
    url: 'https://robot:8443',
    media: {
      audio: true,
      video: {
        width: 1280,
        height: 720
      }
    }
  },
  controller: {
    fpsPolling: 5,
    speedAngular: 1,
    speedLinear: 1,
    deadZoneX: 0.2,
    deadZoneY: 0.2,
    topic: {
      name: '/turtle1/cmd_vel',
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
