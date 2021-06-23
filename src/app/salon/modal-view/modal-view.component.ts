import { Component, Input, OnInit } from '@angular/core';
import { Inspection } from '@app/shared/_models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-view',
  templateUrl: './modal-view.component.html',
})
export class ModalViewComponent implements OnInit {

  @Input() fromParent: any;
  inspect: Inspection;
  
  constructor(public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
    this.inspect = this.fromParent;
  }

  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

}
