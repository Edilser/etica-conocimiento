import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/services/notification.service';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  dismissible = true;
  defaultModal: BsModalRef;
  emailForget;
  showErrorEmail:boolean = true;
  default = {
    keyboard: true,
    class: "modal-dialog-centered"
  };
  user = {
    email: '',
    password: ''
  }
  listUsers = [
    {
      idUser: "3af06771-62b8-409c-92b4-1fa7cacf84ac",
      name: "Grupo 4",
      email: "grupo4@umg.edu.gt",
      password: "Grupo4123",
    },
    {
      idUser: "08e687a1-92c1-4be0-b6ff-911b236505aa",
      name: "Ericka Ivonn Oliva",
      email: "ericka.ivonn@umg.edu.gt",
      password: "Ericka@2023",
    }
  ]
  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
  }

  async login(form: NgForm){
    const foundUser = this.listUsers.find(user => user.email === form.value.email && user.password === form.value.password)
    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser))
      this.router.navigate(["/management"])
      this.notificationService.showToast("Bienvenido", "Bienvenido al panel de conocimiento", "success")
    } else {
      this.notificationService.showToast("Error", "Ocurrió un error al iniciar sesión, verifique sus datos e intente nuevamente.", "danger")
    }
  }
}