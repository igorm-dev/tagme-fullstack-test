import { Component, ElementRef, ViewChild } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ImageCropperDialogComponent } from '../../shared/components/image-cropper-dialog/image-cropper-dialog.component';
import { CreateDishForm } from './create-dish.interface';
import { DishService } from '../../core/services/dish.service';

@Component({
  selector: 'app-create-dish',
  templateUrl: './create-dish.component.html',
  styleUrls: ['./create-dish.component.css'],
  standalone: true,
  imports: [MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatSlideToggleModule, MatSelectModule],
})
export class CreateDishComponent {
  form: FormGroup;
  croppedImageUrl: SafeUrl | null = null;
  isSubmitting = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly dishService: DishService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, Validators.required],
      isAvailable: [true, Validators.required],
      image: [null, Validators.required],
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      const { title, description, category, price, isAvailable, image } = this.form.value;

      this.isSubmitting = true;
      this.form.disable();

      const data: CreateDishForm = {
        title,
        description,
        category,
        price: parseFloat(price),
        isAvailable,
        image: image,
      }
      
      this.dishService.create(data).subscribe({
        next: () => {
          this.form.reset();
          this.showSuccess();
          this.router.navigate(['/books']);

          this.form.enable();
        },
        error: (err) => {
          console.log(err);

          this.showError();
          this.form.enable();
          
          this.isSubmitting = false;
        },
      });
      
    }  else {
      this.form.markAllAsTouched();
    }
  }

  fileChangeEvent(event: Event): void {
    this.form.get('image')?.markAsTouched();
    this.openImageCropper(event);
  }

  openImageCropper(imageChangedEvent: Event) {
    const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: { imageChangedEvent },
    });
  
    dialogRef.afterClosed().subscribe((croppedImageBlob: Blob) => {
      if (croppedImageBlob) {
        this.croppedImageUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(croppedImageBlob));
        this.form.get('image')?.setValue(croppedImageBlob);
        this.form.get('image')?.markAsDirty();
        this.form.get('image')?.markAsTouched();
      } else {
        this.fileInput.nativeElement.value = '';
      }
    });
  }

  async removeImage() {
    this.form.get('image')?.setValue(null);
    this.form.get('image')?.markAsPristine();
    this.form.get('image')?.markAsUntouched();
    this.croppedImageUrl = null;
    this.fileInput.nativeElement.value = '';
  }

  showSuccess() {
    this.snackBar.open('Prato criado com sucesso!', 'Fechar', {
      panelClass: 'snackbar-success',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  showError() {
    this.snackBar.open('Erro ao criar prato!', 'Fechar', {
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
