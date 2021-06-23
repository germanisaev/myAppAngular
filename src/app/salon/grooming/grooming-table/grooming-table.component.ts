import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalConfirmComponent } from '@app/salon/modal-confirm';
import { ModalCreateComponent } from '@app/salon/modal-create';
import { ModalEditComponent } from '@app/salon/modal-edit';
import { ModalViewComponent } from '@app/salon/modal-view';
import { Inspection } from '@app/shared/_models';
import { CustomerService, GroomingService } from '@app/shared/_services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'grooming-table',
  templateUrl: './grooming-table.component.html',
})
export class GroomingTableComponent implements OnInit {


  @Input()
  inspections: Observable<Array<Inspection>>;
  duplicate$: Observable<Array<Inspection>>;

  @Input()
  searchText: string = '';

  @Input()
  editInspectionId = 0;

  @Output()
  filterInspection = new EventEmitter<Observable<Array<Inspection>>>();

  @Output()
  filterCancel = new EventEmitter<any>();

  closeResult: string = '';
  currentUser: any;
  fromDate: Date;
  toDate: Date;
  minDate: Date;
  maxDate: Date;

  constructor(
    private modalService: NgbModal,
    private service: GroomingService,
    private customerService: CustomerService,
  ) { }

  ngOnInit(): void {
    this.getPermition();
  }

  refresh(): void {
    window.location.reload();
  }

  onClear() {
    console.log('clear');
    this.fromDate = null;
    this.toDate = null;
    this.filterCancel.emit(this.inspections);
  }

  reverseTimeStamp(datetimeString) {
    const reverse = new Date(datetimeString.split("-").reverse().join("-"));
    return reverse.getTime();
  }

  splitDatetime(datetimeString) {
    return datetimeString.split(" ")[0];
  }

  filterDate() {

    let fromdate = moment(this.fromDate).format('DD-MM-YYYY');
    let todate = moment(this.toDate).format('DD-MM-YYYY');

    if (this.fromDate && this.toDate) {
      const selectedMembers = this.inspections.pipe(
        map(data => data.filter(m => {
          return this.reverseTimeStamp(this.splitDatetime(m.Appointment)) >= this.reverseTimeStamp(fromdate)
            && this.reverseTimeStamp(this.splitDatetime(m.Appointment)) <= this.reverseTimeStamp(todate)
        })
        ));
      this.duplicate$ = selectedMembers;
    } else {
      this.duplicate$ = this.inspections;
    }

    this.filterInspection.emit(this.duplicate$);

    console.log(this.duplicate$);
  }

  openModal(content: any, inspect?: any) {
    let modalRef = null;
    if (content === 'view') {
      modalRef = this.modalService.open(ModalViewComponent,
        {
          scrollable: true,
          windowClass: 'myCustomModalClass',
        });
    }
    if (content === 'create') {
      modalRef = this.modalService.open(ModalCreateComponent,
        {
          scrollable: true,
          windowClass: 'myCustomModalClass',
        });
    }
    if (content === 'edit') {
      modalRef = this.modalService.open(ModalEditComponent,
        {
          scrollable: true,
          windowClass: 'myCustomModalClass',
        });
    }
    if (content === 'confirm') {
      modalRef = this.modalService.open(ModalConfirmComponent,
        {
          scrollable: true,
          windowClass: 'myCustomModalClass',
        });
    }

    modalRef.componentInstance.fromParent = inspect;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'created') {
        this.refreshData();
      }
      if (result === 'updated') {
        this.refreshData();
        this.refresh();
      }
      if (result === 'yes') {
        this.onDelete(inspect);
        this.service.deleteItem(inspect.Id).subscribe(response => {
          console.log(response);
          this.refreshData();
        });
      }

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  refreshData() {
    this.inspections = this.service.getAll();
  }

  onDelete(inspect: any) {
    this.inspections = this.inspections.pipe(
      map((value, index) => value.filter(x => { x.Id !== inspect.Id; })
      ));
  }

  getPermition() {
    console.log(localStorage.getItem('storage'));
    var storage = localStorage.getItem('storage');
    var user = storage.split(' ');
    this.customerService.getByName(user[0], user[1]).subscribe(response => this.currentUser = response.id);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
