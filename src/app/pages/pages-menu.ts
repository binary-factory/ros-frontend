import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'ROS',
    icon: 'nb-keypad',
    expanded: true,
    children: [
      {
        title: 'Nodes',
        link: '/ros/nodes'
      },
      {
        title: 'Topics',
        link: '/ros/topics'
      },
      {
        title: 'Services',
        link: '/ros/services'
      },
      {
        title: 'Params',
        link: '/ros/params'
      }
    ]
  }
];
