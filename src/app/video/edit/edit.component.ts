import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import IClip from 'src/app/modals/clip.modal';
import { ModalService } from 'src/app/services/modal.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  constructor(private modal: ModalService, private clipService: ClipService) { }

  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  showAlert = false;
  alertMsg = 'Please wait, updating clip.';
  alertColor = 'blue';
  inSubmission = false;

  clipId = new FormControl('', {
    nonNullable: true
  })
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipId
  });

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  ngOnChanges(): void {
    if(!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docId as string);
    this.title.setValue(this.activeClip.title);
  }

  async submit() {
    if(!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait, updating clip.'

    try {
      
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later';
      return;
    }

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!!';

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
  }

}
