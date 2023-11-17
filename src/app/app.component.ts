import { Component } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import * as moment from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-scan-hcm';
  private readonly _destroyRef: Subject<void> = new Subject();
  isConnect: boolean;
  hasPermission: boolean = false;

  torchEnabled = false;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  enableText: boolean = true;
  availableDevices: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo;
  deviceSelected: string;
  hasDevices: boolean;
  tryHarder = false;
  formatsEnabled: BarcodeFormat[] = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
    BarcodeFormat.QR_CODE,
  ];
  ticketNumber: string = '';
  dateReward: string = '';
  ticketType: string = '';
  kyHieu: string = '';

  constructor() {

  }


  ngOnInit(): void {
    console.log(1);

  }


  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    this.torchAvailable$.next(isCompatible || false);
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) {
      return;
    }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  onCodeResult(resultString: string) {
    console.log(resultString);


    this.ticketNumber = resultString.slice(-6)
    this.dateReward = moment(resultString.slice(-14, -6), 'DDMMYYYY').format("DD/MM/yyyy")

    this.ticketType = resultString.slice(0, 1)
    this.kyHieu = resultString.slice(1, 5)


    console.log(resultString);

  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }
}
