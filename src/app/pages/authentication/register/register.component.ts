import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['619be69a94fe7a57107594cd', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
      
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  register() {
    
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    this.loading = true;
    
    this.authService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
              debugger
              this.notificationService.showSwal('Registro exitoso', 'te has registrado correctamente', 'success')
              this.router.navigate(['../login'], { relativeTo: this.route });
            },
            error => {
              debugger

              this.notificationService.showSwal('Error', 'Error al crear la cuenta', 'warning');
              this.loading = false;
            });
}
  
}
