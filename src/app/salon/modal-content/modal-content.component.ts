import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Grooming, User, Veterinar } from 'src/app/shared/_models';
import { CustomerService, GroomingService, VeterinarService } from 'src/app/shared/_services';
import { Services } from 'src/app/shared/_models/services.enum';
import { PetTypes } from 'src/app/shared/_models/pet-type.enum';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html'
})
export class ModalContentComponent implements OnInit {

  @Input() fromParent: any;
  closeResult: string = '';
  form: FormGroup;
  loading = false;
  submitted = false;
  customer: User;

  veterinar$: Observable<Veterinar>;

  veterinars: Array<Veterinar> = [];
  owners: Array<User> = [];

  enumServices: { id: number; name: string }[] = [];
  enumTypes: { id: number; name: string }[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private veterinarService: VeterinarService,
    private customerService: CustomerService,
    private groomingService: GroomingService,
  ) {
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
    this.customerService.getById(this.fromParent.ownerId).subscribe(response => {
      this.customer = response;
      const fullName = this.customer.firstName + ' ' + this.customer.lastName;
      this.OwnerId.setValue(fullName, {
        onlySelf: true
      });
    });
  }

  ngOnInit() {

    this.createForm();
    this.getVeterinars();
    this.enumInit();

    const grooming: Grooming = this.fromParent;

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

  enumInit() {
    const dataServices = new Services();
    this.enumServices = dataServices.get();
    const dataPetTypes = new PetTypes();
    this.enumTypes = dataPetTypes.get();
  }

  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

  getServiceBy(id: any) {
    const dataServices = new Services();
    return dataServices.getBy(id);
  }

  getTypeBy(id: any) {
    const dataPetTypes = new PetTypes();
    return dataPetTypes.getBy(id);
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

    let grooming = new Grooming();
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
    this.closeModal('updated');
  }

}
