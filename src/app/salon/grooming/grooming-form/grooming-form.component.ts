import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Inspection, User, Veterinar } from '@app/shared/_models';
import { PetTypes } from '@app/shared/_models/pet-type.enum';
import { Services } from '@app/shared/_models/services.enum';
import { CustomerService, GroomingService, VeterinarService } from '@app/shared/_services';
import * as moment from 'moment';

@Component({
  selector: 'grooming-form',
  templateUrl: './grooming-form.component.html',
})
export class GroomingFormComponent implements OnInit {

  @Input()
  buttonText = 'Submit Inspection';

  @Input() fromParent: any;

  @Output()
  submitInspection = new EventEmitter<Inspection>();

  form: FormGroup;
  loading = false;
  submitted = false;

  veterinars: Array<Veterinar> = [];
  owners: Array<User> = [];
  customer: User;

  enumServices: { id: number; name: string }[] = [];
  enumTypes: { id: number; name: string }[] = [];


  constructor(
    private fb: FormBuilder,
    private veterinarService: VeterinarService,
    private customerService: CustomerService,
    private groomingService: GroomingService,
    ) { }

  ngOnInit() {
    this.createForm();
    this.getVeterinars();
    this.enumInit();
    this.setInspectionValues();
  }

  createForm() {
    this.form = new FormGroup({
      Id: new FormControl(''),
      AppointmnetGroup: new FormGroup({
        appointmnetDate: new FormControl(moment().format('YYYY-MM-DD').toString()),
        appointmnetTime: new FormControl(moment().format('HH:mm').toString())
      }),
      PetName: new FormControl(''),
      PetType: new FormControl(''),
      OwnerId: new FormControl(''),
      OwnerName: new FormControl(''),
      Services: new FormControl(''),
      Veterinar: new FormControl(''),
    });
  }

  get f() { return this.form.controls; }
  get Id() { return this.form.get('Id'); }
  get Veterinar() { return this.form.get('Veterinar'); }
  get PetType() { return this.form.get('PetType'); }
  get PetName() { return this.form.get('PetName'); }
  get OwnerId() { return this.form.get('OwnerId'); }
  get OwnerName() { return this.form.get('OwnerName'); }
  get Appointmnet() { return this.form.get('Appointmnet'); }
  get Services() { return this.form.get('Services'); }
  get appointmnetDate() { return this.form.get('AppointmnetGroup.appointmnetDate'); }
  get appointmnetTime() { return this.form.get('AppointmnetGroup.appointmnetTime'); }

  setInspectionValues() {
    const grooming: Inspection = this.fromParent;

    let datetime = grooming.Appointment;
    let date = datetime.split(' ')[0];
    let time = datetime.split(' ')[1];

    let reverseDate = date.split('-');
    let d = Number(reverseDate[0]);
    let m = Number(reverseDate[1]);
    let y = Number(reverseDate[2]);
    let createDate = new Date(0);
    createDate.setDate(d);
    createDate.setMonth(m - 1);
    createDate.setFullYear(y);

    this.form.patchValue({
      Id: grooming.Id,
      AppointmnetGroup: ({
        appointmnetDate: moment(createDate).format('YYYY-MM-DD'),
        appointmnetTime: time
      }),
      PetName: grooming.PetName,
      PetType: grooming.PetTypeId,
      OwnerId: grooming.OwnerId,
      OwnerName: grooming.OwnerName,
      Services: grooming.ServiceId,
      Veterinar: grooming.VeterinarId,
    });
  }

  getVeterinars() {
    this.veterinarService.getAll().subscribe(response =>
      this.veterinars = response
    );
  }

  getVeterinarBy(id: any): string {
    const data = this.veterinars.filter(x => { return x.id == id })[0];
    return data.firstName + ' ' + data.lastName;
  }

  getCustomerName() {
    this.customerService.getById(this.fromParent.OwnerId).subscribe(response => {
      this.customer = response;
      const fullName = this.customer.firstName + ' ' + this.customer.lastName;
      this.OwnerId.setValue(fullName, {
        onlySelf: true
      });
    });
  }

  enumInit() {
    const dataServices = new Services();
    this.enumServices = dataServices.get();
    const dataPetTypes = new PetTypes();
    this.enumTypes = dataPetTypes.get();
  }

  getServiceBy(id: any) {
    const dataServices = new Services();
    return dataServices.getBy(id);
  }

  getTypeBy(id: any) {
    const dataPetTypes = new PetTypes();
    return dataPetTypes.getBy(id);
  }

  doSubmitInspection() {

    this.submitted = true;

    if (this.form.invalid) {
      return
    }

    this.submitInspection.emit({
      ...this.form.value,
    });

    this.setInspectionValues();

  }  

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return
    }

    let date = this.appointmnetDate.value.split('-');
    let time = this.appointmnetTime.value.split(':');
    let id = this.Id.value;

    let mydate = new Date(0);
    mydate.setFullYear(date[2].length == 4 ? date[2] : date[0]);
    mydate.setMonth(date[1] - 1);
    mydate.setDate(date[0].length == 4 ? date[2] : date[0]);
    mydate.setHours(time[0]);
    mydate.setMinutes(time[1]);
    mydate.setSeconds(0);
    let exp = moment(mydate).format('DD-MM-YYYY HH:mm');

    let grooming = new Inspection();
    grooming.Id = id;
    grooming.Appointment = exp;
    grooming.PetName = this.PetName.value;
    grooming.PetTypeId = this.PetType.value;
    grooming.PetTypeName = this.getTypeBy(this.PetType.value);
    grooming.OwnerId = this.OwnerId.value;
    grooming.OwnerName = this.OwnerName.value;
    grooming.ServiceId = this.Services.value;
    grooming.ServiceName = this.getServiceBy(this.Services.value);
    grooming.VeterinarId = this.Veterinar.value;
    grooming.VeterinarName = this.getVeterinarBy(this.Veterinar.value);

    this.groomingService.updateItem(grooming, id).subscribe(response => console.log('Success Create: ' + response));
    //this.closeModal('updated');
  }

}
