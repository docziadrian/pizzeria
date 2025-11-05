import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  orderForm: FormGroup;

  constructor(private fb: FormBuilder) {
    //TODO: Validáció angular komponens?
    this.orderForm = this.fb.group({
      nev: ['', [Validators.required, Validators.minLength(3)]],
      iranyitoszam: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      varos: ['', [Validators.required, Validators.minLength(2)]],
      utca: ['', [Validators.required, Validators.minLength(3)]],
      hazszam: ['', [Validators.required]],
      telefonszam: [
        '',
        [Validators.required, Validators.pattern(/^(\+36|06)?[0-9]{9}$/)],
      ],
      fizetesiMod: ['keszpenz', Validators.required],
    });
  }

  // Űrlap beküldése
  onSubmit(): void {
    if (this.orderForm.valid) {
      console.log('Rendelési adatok:', this.orderForm.value);
      return;
    } else {
      Object.keys(this.orderForm.controls).forEach((key) => {
        this.orderForm.get(key)?.markAsTouched(); // HIba üzenetek miatt
      });
    }
  }

  // Hiba üzenetek miatt
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  // Hiba üzenetek miatt
  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}
