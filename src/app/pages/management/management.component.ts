import { Component, OnInit} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service'; 
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { DomSanitizer } from '@angular/platform-browser';
  
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit {
  
  idUser: string = ''
  modules: Array<any> = []
  userModuleViews: Array<any> = []
  userExams: Array<any> = []
  constructor(
    private apiService: ApiService,
    private router: Router,
    private notificationService: NotificationService,
    private angularFireDatabase: AngularFireDatabase,
    private sanitizer: DomSanitizer
  ) {}
  
  ngOnInit() {
    this.getUserData()
  }
  
  getUserData () {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      this.idUser = user.idUser

      this.angularFireDatabase.object(`banco/users/${this.idUser}/modulesView`).query.once('value').then(res => {
        if (res.val()) {
          const keys = Object.keys(res.val())
          this.userModuleViews = keys.map(element => res.val()[element].key)
        }
        this.getExams()
      }).catch(() => {
        console.log('')
      })
    }
  }

  getExams () {
    this.angularFireDatabase.object(`banco/users/${this.idUser}/exams`).query.once('value').then(res => {
      if (res.val()) {
        const key = Object.keys(res.val())
        this.userExams = key.map(keyValue => res.val()[keyValue])
      }
      this.getModules()
    })
  }

  getModules () {
    this.notificationService.showLoadingSwal('Obteniendo modulos', 'Por favor espere un momento...')
    this.angularFireDatabase.list('banco/modules').snapshotChanges().subscribe((data: any) => {
      this.notificationService.closeLoadingSwal()
      this.modules = []
      data.map(module => {
        const isTakeQuiz = this.userExams.find(exam => exam.key === module.key) ? true : false
        this.modules.push({
          key: module.key,
          ...module.payload.val(),
          url: this.sanitizer.bypassSecurityTrustResourceUrl(module.payload.val().url),
          isView: this.userModuleViews.includes(module.key),
          isTakeQuiz
        })
      })
    }, error => {
      this.notificationService.closeLoadingSwal()
      this.notificationService.showSwal('OPcurrió un invonceniento al obtener los datos', '', 'error')
    })
  }

  openModule (module: any) {
    const currentOrder = module.order;
    const back = currentOrder - 1;
    const backOrder = back <= 0 ? 1 : back
    const permit = this.modules.find(mod => mod.order === backOrder)
    if (module.order === 1) {
      this.router.navigate(['view-module', module.key])
    } else if (!permit.isView) {
      if (backOrder === 1) {
        if (!permit.isView) {
          this.notificationService.showSwal('Por ahora no puedes ver este módulo', `Primero debes ver visualizar el módulo de ${permit.title}`, 'error')
          return
        } else if (!permit.isTakeQuiz) {
          this.notificationService.showSwal('Por ahora no puedes ver este módulo', `Primero debes tomar la evaluación del módulo de ${permit.title}`, 'error')
          return
        }
        this.router.navigate(['view-module', module.key])
      } else {
        this.notificationService.showSwal('Por ahora no puedes ver este módulo', `Primero debes ver visualizar el módulo de ${permit.title}`, 'error')
      }
    } else if (!permit.isTakeQuiz) {
      this.notificationService.showSwal('Por ahora no puedes ver este módulo', `Primero debes tomar la evaluación del módulo de ${permit.title}`, 'error')
    } else {
      this.router.navigate(['view-module', module.key])
    }
  }

  ngOnDestroy () {
	}
}
