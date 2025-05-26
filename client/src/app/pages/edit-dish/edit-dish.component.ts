import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DishService } from '../../core/services/dish.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EditDishForm } from './edit-dish.interface';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';

import { ImageCropperDialogComponent } from '../../shared/components/image-cropper-dialog/image-cropper-dialog.component';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  standalone: true,
  selector: 'app-edit-dish',
  templateUrl: './edit-dish.component.html',
  styleUrls: ['./edit-dish.component.css'],
  imports: [MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, ReactiveFormsModule, MatSlideToggleModule, MatSelectModule, RouterModule],
})
export class EditDishComponent implements OnInit {
  form!: FormGroup;
  croppedImageUrl: SafeUrl | null = null;
  isSubmitting = false;

  uuid!: string;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private readonly loadingService: LoadingService,
    private readonly dishService: DishService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, Validators.required],
      isAvailable: [true, Validators.required],
      image: [null],
    });
  }

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');

    if (uuid) {
      this.uuid = uuid;
      this.loadDish(uuid);
    }
  }

  loadDish(uuid: string) {
    this.dishService.getByUuid(uuid).subscribe({
      next: async (dish) => {
        this.form.patchValue(dish);
        this.croppedImageUrl = dish.imageUrl;
        this.form.updateValueAndValidity();
      },
      error: (error) => {
        console.error('Erro ao carregar prato:', error);
        this.showError('Erro ao carregar prato!');
      }
    });
  }

  showSuccess() {
    this.snackBar.open('Prato atualizado com sucesso!', 'Fechar', {
      panelClass: 'snackbar-success',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Fechar', {
      panelClass: ['snackbar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { title, description, category, price, isAvailable, image } = this.form.value;

      this.isSubmitting = true;
      this.form.disable();
      this.loadingService.show();

      const data: EditDishForm = {
        title,
        description,
        category,
        price: parseFloat(price),
        isAvailable,
        image: image,
      };

      this.dishService.update(this.uuid, data).subscribe({
        next: () => {
          this.form.reset();
          this.showSuccess();
          this.router.navigate(['/']);
          this.form.enable();
        },
        error: (err) => {
          console.error(err);
          this.showError('Erro ao atualizar prato!');
          this.form.enable();
          this.isSubmitting = false;
        },
        complete: () => {
          this.loadingService.hide();
        }
      });
    }
  }

  async removeImage() {
    this.form.get('image')?.setValue(null);
    this.form.get('image')?.markAsPristine();
    this.form.get('image')?.markAsUntouched();
    this.croppedImageUrl = null;
    this.fileInput.nativeElement.value = '';
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

  private async urlToBlob(imageUrl: string): Promise<Blob> {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Erro ao carregar imagem');
    }
    return await response.blob();
  }
}
