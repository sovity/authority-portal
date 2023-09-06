import {Component} from '@angular/core';
import {SlideInterface} from '../../../common/components/image-slider/image-slider/slide.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  slides: SlideInterface[] = [
    {
      url: 'https://images.pexels.com/photos/5244314/pexels-photo-5244314.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'View and manage all users assigned to the company.',
    },
    {
      url: 'https://images.pexels.com/photos/7580715/pexels-photo-7580715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Get to know the supported use cases to start your journey',
    },
    {
      url: 'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Transparent services and applications for your ideas',
    },
    {
      url: 'https://images.pexels.com/photos/10156134/pexels-photo-10156134.jpeg?auto=compress&cs=tinysrgb&w=1600',
      title: 'Join our large ecosystem of modern applications',
    },
    {
      url: 'https://images.pexels.com/photos/532173/pexels-photo-532173.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      title: 'Control your data in transparent and intuitive way',
    },
  ];
}
