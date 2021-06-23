import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Grooming, User, Veterinar } from '@app/shared/_models';
import { PetTypes } from '@app/shared/_models/pet-type.enum';
import { Services } from '@app/shared/_models/services.enum';
import { CustomerService, GroomingService, VeterinarService } from '@app/shared/_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'grooming-form',
  templateUrl: './grooming-form.component.html'
})
export class GroomingFormComponent implements OnInit {

  @Input() fromParent: any;

  @Input()
  buttonText = 'Submit Grooming';

  @Output()
  submitGrooming = new EventEmitter<Grooming>();

  form: FormGroup;
  loading = false;
  submitted = false;
  customer: User;

  enumServices: { id: number; name: string }[] = [];
  enumTypes: { id: number; name: string }[] = [];

  veterinars$: Observable<Array<Veterinar>>;
  owners$: Observable<Array<User>>;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private veterinarService: VeterinarService,
    private customerService: CustomerService,
    private groomingService: GroomingService,
    ) { }

  ngOnInit() {
    this.createForm();
    this.getVeterinars();
    this.enumInit();
    this.onIntiGrooming();
  }

  createForm() {
    this.form = this.fb.group({
      Id: [''],
      AppointmnetGroup: this.fb.group({
        appointmnetDate: [moment().format('DD-MM-YYYY').toString(), Validators.required],
        appointmnetTime: [moment().format('HH:mm').toString(), Validators.required]
      }),
      PetName: ['', Validators.required],
      PetType: ['', Validators.required],
      OwnerId: [''],
      OwnerName: [''],
      Services: ['', Validators.required],
      Veterinar: ['', Validators.required]
    });
  }

  enumInit() {
    const dataServices = new Services();
    this.enumServices = dataServices.get();
    const dataPetTypes = new PetTypes();
    this.enumTypes = dataPetTypes.get();
  }

  getVeterinars() {
    this.veterinars$ = this.veterinarService.getAll();
  }

  onIntiGrooming() {
    const grooming: Grooming = this.fromParent;

    this.submitGrooming.emit({
      ...this.form.value,
    });

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

  getVeterinarBy(id: any) {
    const data = this.veterinars$.pipe(
      switchMap((value, index)=> value.filter(x => { return x.id == id}) ));
    return data;
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

  doSubmit() {
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

    const veterinar$ = this.getVeterinarBy(this.Veterinar.value);

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
    grooming.VeterinarName = '?';

    this.groomingService.updateItem(grooming, id).subscribe(response => console.log('Success Create: ' + response));
    this.closeModal('updated');


  }

}
