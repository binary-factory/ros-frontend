import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'ROS',
    icon: 'nb-keypad',
    expanded: true,
    children: [
      {
        title: 'Nodes',
        link: '/pages/ros/nodes'
      },
      {
        title: 'Topics',
        link: '/pages/ros/topics'
      },
      {
        title: 'Services',
        link: '/pages/ros/services'
      },
      {
        title: 'Params',
        link: '/pages/ros/params'
      }
    ]
  }
];
