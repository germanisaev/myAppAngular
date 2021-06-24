import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalCreateComponent } from '@app/salon/modal-create';
import { Inspection } from '@app/shared/_models';
import { GroomingService } from '@app/shared/_services';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'gromming-tools',
  templateUrl: './gromming-tools.component.html',
})
export class GrommingToolsComponent implements OnInit {

  @Input()
  inspections: Observable<Inspection[]>;

  @Input()
  searchText: string = '';

  @Output()
  searchInspection = new EventEmitter<number>();
  
  closeResult: string = '';
  fromDate: Date;
  toDate: Date;
  minDate: Date;
  maxDate: Date;
  
  constructor(private modalService: NgbModal,private service: GroomingService,) { }

  ngOnInit(): void {
  }

  doSearch(value: any) {
    this.searchInspection.emit(value);
  }

  onClear() {
    console.log('clear');
    this.fromDate = null;
    this.toDate = null;
    /* this.duplicate$ = this.inspections; */
  }

  reverseDatetime(datetimeString) {
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
          return this.reverseDatetime(this.splitDatetime(m.Appointment)) >= this.reverseDatetime(fromdate)
            && this.reverseDatetime(this.splitDatetime(m.Appointment)) <= this.reverseDatetime(todate)
        })
        ));
      /* this.duplicate$ = selectedMembers; */
    } else {
      /* this.duplicate$ = this.inspections; */
    }
    /* console.log(this.duplicate$);  */
  }

  openModal(content: any) {
    let modalRef = null;
    if(content === 'create') {
      modalRef = this.modalService.open(ModalCreateComponent,
        {
          scrollable: true,
          windowClass: 'myCustomModalClass',
        });
    }
    
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

  refreshData() {
    /* this.service.getAll().subscribe(response => this.inspections = Object.assign({}, response)); */
  }

  refresh(): void {
    window.location.reload();
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
