import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Grooming } from 'src/app/shared/_models';
import { CustomerService, GroomingService } from 'src/app/shared/_services';
import { ModalAppointmnetComponent } from '../modal-appointmnet';
import { ModalContentComponent } from '../modal-content/modal-content.component';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-grooming-salon-list',
  templateUrl: './grooming-salon-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroomingSalonListComponent implements OnInit {

  inspections$: Observable<Array<Grooming>>;
  duplicate$: Observable<Array<Grooming>>;
  fromDate: Date;
  toDate: Date;
  minDate: Date;
  maxDate: Date;

  @Input() public items: Grooming[];
  
  searchText: string = '';
  searchDate: string = '';
  closeResult: string = '';
  currentUser: any;

  constructor(
    private modalService: NgbModal,
    private service: GroomingService,
    private customerService: CustomerService,
  ) {
  }

  ngOnInit(): void {
    console.log('on init');
    this.getPermition();
    this.refreshData();
    this.duplicate$ = this.inspections$;
  }

  onClear() {
    console.log('clear');
    this.fromDate = null;
    this.toDate = null;
    this.duplicate$ = this.inspections$;
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
      const selectedMembers = this.inspections$.pipe(
        map(data => data.filter(m => {
          return this.reverseTimeStamp(this.splitDatetime(m.Appointment)) >= this.reverseTimeStamp(fromdate)
            && this.reverseTimeStamp(this.splitDatetime(m.Appointment)) <= this.reverseTimeStamp(todate)
        })
        ));
      this.duplicate$ = selectedMembers;
    } else {
      this.duplicate$ = this.inspections$;
    }
    console.log(this.duplicate$); 
  }

  refreshData() {
    this.inspections$ = this.service.getAll();
  }

  getPermition() {
    console.log(localStorage.getItem('storage'));
    var storage = localStorage.getItem('storage');
    var user = storage.split(' ');
    this.customerService.getByName(user[0], user[1]).subscribe(response => this.currentUser = response.id);
  }

  refresh(): void {
    window.location.reload();
  }

  openModalConfirm(content: any, itemId: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.onDelete(itemId);
        this.service.deleteItem(itemId).subscribe(response => {
          console.log(response);
          this.refreshData();
          this.refresh();
        });
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAppointmnet() {
    const modalRef = this.modalService.open(ModalAppointmnetComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
      });

    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'created') {
        this.refreshData();
        this.refresh();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModal(flag: number, data: any) {

    const modalRef = this.modalService.open(ModalContentComponent,
      {
        scrollable: true,
        windowClass: 'myCustomModalClass',
      });

    modalRef.componentInstance.formType = flag;
    modalRef.componentInstance.fromParent = data;
    modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'updated') {
        this.refreshData();
        this.refresh();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onDelete(id: any) {
    this.inspections$ = this.inspections$.pipe(
      map(res => res.filter(x => x.Id != id)));
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
