import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { PointCloudSettings } from '../point-cloud/point-cloud.component';

export const PointCloudSettingsData = new InjectionToken<PointCloudSettings>('PointCloudSettingsData');

@Component({
  selector: 'ngx-point-cloud-settings',
  templateUrl: './point-cloud-settings.component.html',
  styleUrls: ['./point-cloud-settings.component.scss']
})
export class PointCloudSettingsComponent implements OnInit {

  settingsForm = new FormGroup({
    pointLimit: new FormControl(''),
    pointSize: new FormControl(''),
    isColorful: new FormControl(''),
    pointShape: new FormControl('')
  });

  @ViewChild('form')
  form: NgForm;

  constructor(@Inject(PointCloudSettingsData) public settings: PointCloudSettings) {
    console.log(settings);
  }

  ngOnInit() {
    this.settingsForm.setValue(this.settings);
  }

}
