import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Inspection, User, Veterinar } from 'src/app/shared/_models';
import { CustomerService, GroomingService, VeterinarService } from 'src/app/shared/_services';
import { Services } from '@app/shared/_models/services.enum';
import { PetTypes } from '@app/shared/_models/pet-type.enum';


@Component({
  selector: 'modal-create',
  templateUrl: './modal-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCreateComponent implements OnInit, AfterViewInit {

  @Input() fromParent: any;
  @Input() formType: string;
  @Input() formSaved: boolean;
  closeResult: string = '';
  form: FormGroup;
  loading = false;
  submitted = false;
  customer: User;
  alert = false;

  enumServices: { id: number; name: string }[] = [];
  enumTypes: { id: number; name: string }[] = [];

  veterinars: Array<Veterinar> = [];
  owners: Array<User> = [];
  ownerValue: any = '';

  constructor(
    public activeModal: NgbActiveModal,
    private veterinarService: VeterinarService,
    private customerService: CustomerService,
    private groomingService: GroomingService,
    private formBuilder: FormBuilder,
  ) {
  }

  get f() { return this.form.controls; }
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
    this.form = this.formBuilder.group({
      Id: [''],
      AppointmnetGroup: this.formBuilder.group({
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

  getVeterinars() {

    this.veterinarService.getAll().subscribe(response => {
      this.veterinars = response;
      console.log(response);
    });
  }

  getOwners() {
    this.customerService.getAll().subscribe(response => {
      this.owners = response;
    },
      error => {
        console.error(error);
      });
  }

  getOwner() {

    const ownerName = localStorage.getItem('storage');
    let data = ownerName.split(' ');
    this.OwnerName.setValue(ownerName, {
      onlySelf: true
    });

    this.customerService.getByName(data[0], data[1]).subscribe(response => {
      this.customer = response;
      console.log(this.customer);
      const ownerId = this.customer.id;
      this.OwnerId.setValue(ownerId, {
        onlySelf: true
      });
    });
  }

  ngOnInit() {
    console.log(this.fromParent);
    this.enumInit();
    this.createForm();
    this.getVeterinars();
  }

  enumInit() {
    const dataServices = new Services();
    this.enumServices = dataServices.get();
    const dataPetTypes = new PetTypes();
    this.enumTypes = dataPetTypes.get();
  }

  ngAfterViewInit() {
    this.getOwner();
  }

  getServiceBy(id: any) {
    const dataServices = new Services();
    return dataServices.getBy(id);
  }

  getTypeBy(id: any) {
    const dataPetTypes = new PetTypes();
    return dataPetTypes.getBy(id);
  }


  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid)
      return;

    let date = this.appointmnetDate.value.split('-');
    let time = this.appointmnetTime.value.split(':');

    let mydate = new Date(0);
    mydate.setFullYear(date[2].length == 4 ? date[2] : date[0]);
    mydate.setMonth(date[1] - 1);
    mydate.setDate(date[0].length == 4 ? date[2] : date[0]);
    mydate.setHours(time[0]);
    mydate.setMinutes(time[1]);
    mydate.setSeconds(0);
    let exp = moment(mydate).format('DD-MM-YYYY HH:mm');

    let grooming = new Inspection();
    grooming.Appointment = exp;
    grooming.PetName = this.PetName.value;
    grooming.PetTypeId = this.PetType.value.id;
    grooming.PetTypeName = this.PetType.value.name;
    grooming.OwnerId = this.OwnerId.value;
    grooming.OwnerName = this.OwnerName.value;
    grooming.ServiceId = this.Services.value.id;
    grooming.ServiceName = this.Services.value.name;
    grooming.VeterinarId = this.Veterinar.value.id;
    grooming.VeterinarName = this.Veterinar.value.firstName + ' ' + this.Veterinar.value.lastName;

    this.groomingService.getExist(grooming).subscribe(response => {
      if (response == 0) {
        this.groomingService.createItem(grooming).subscribe(response => {
          console.log('Success Create: ' + response);
          this.closeModal('created');
        });
      }
      else {
        this.alert = true;
      }
    })
  }

}
