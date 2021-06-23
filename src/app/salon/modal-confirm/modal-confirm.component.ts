import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-confirm',
  templateUrl: './modal-confirm.component.html',
})
export class ModalConfirmComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

  closeModal(sendData) {
    this.activeModal.close(sendData);
  }

}
