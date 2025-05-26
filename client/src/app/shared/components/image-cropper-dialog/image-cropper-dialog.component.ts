import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  templateUrl: './image-cropper-dialog.component.html',
  styleUrls: ['./image-cropper-dialog.component.css'],
  selector: 'app-image-cropper-dialog',
  standalone: true,
  imports: [ImageCropperComponent, MatButtonModule],
})
export class ImageCropperDialogComponent {
  croppedImage!: Blob;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ImageCropperDialogComponent>
  ) {}

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedImage = event.blob;
    }
  }

  cancelCrop() {
    this.dialogRef.close();
  }

  confirmCrop() {
    this.dialogRef.close(this.croppedImage);
  }
}
