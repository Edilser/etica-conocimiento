import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-view-module',
  templateUrl: './view-module.component.html',
  styleUrls: ['./view-module.component.scss']
})
export class ViewModuleComponent implements OnInit {

  userModuleViews = []
  modules = []
  currentModule: any = {}
  permitNext: boolean = true
  permitQuiz: boolean = true
  idUser = ''
  currentQuiz: any = {}
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private angularFireDatabase: AngularFireDatabase,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) { }

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
          keys.forEach(element => {
            const entry = res.val()[element].key
            this.userModuleViews.push(entry)
          })
        }
        this.getExams()
        this.getModules()
      }).catch(() => {
        console.log('')
      })
    }
  }

  getExams () {
    this.angularFireDatabase.object(`banco/users/${this.idUser}/exams`).query.once('value').then(res => {
      if (res.val()) {
        const key = Object.keys(res.val())
        this.currentQuiz = {
          ...res.val()[key[0]],
          keyQuiz: key[0]
        }
        if (this.currentQuiz.intents === 3 || this.currentQuiz.result) this.permitQuiz = false
      }
    })
  }

  getModules () {
    this.notificationService.showLoadingSwal('Obteniendo modulos', 'Por favor espere un momento...')
    this.angularFireDatabase.object('banco/modules').query.once('value').then(res => {
      const keys = Object.keys(res.val())
      keys.forEach(key => {
        const entry = res.val()[key]
        this.modules.push({
          key,
          ...entry,
          isView: this.userModuleViews.includes(key),
          tempUrl: entry.url
        })
      })
      this.infoModule()
    })
    .catch(() => {
      this.notificationService.closeLoadingSwal()
      this.notificationService.showSwal('OPcurrió un invonceniento al obtener los datos', '', 'error')
    })
  }

  infoModule () {
    let module: any = {}
    let values: any = {}
    const idModule = this.route.snapshot.paramMap.get('id');
    if (idModule) {
      const mod: any = this.modules.find(mod => mod.key === idModule)
      if (mod) {
        values = Object.assign({}, mod)
        values.url = this.sanitizer.bypassSecurityTrustResourceUrl(values.tempUrl)
        this.currentModule = values;
        this.activeModuleFirebase()
      } else if (idModule === 'active') {
        const index = this.modules.map(mod => mod.isView).lastIndexOf(true)
        module = this.modules[index]
        values = Object.assign({}, module)
        values.url = this.sanitizer.bypassSecurityTrustResourceUrl(values.tempUrl)
        this.currentModule = values
        this.activeNextModule()
        this.activeModuleFirebase()
      } else {
        this.notificationService.showSwal('No fue posible obtener la información del módulo', '', 'error')
        setTimeout(() => {
          this.goToHome()
        }, 2500);
      }
    } else {
      this.goToHome()
    }
  }

  goToHome () {
    this.router.navigate(['management'])
  }

  activeNextModule () {
    const order = this.currentModule.order
    if (order < 3) this.permitNext = true
    else this.permitNext = false
  }

  nextModule () {
    this.notificationService.showLoadingSwal('Cargando el siguiente módulo', '')
    const order = this.currentModule.order + 1
    this.currentModule = {}
    setTimeout(() => {
      const data: any = this.modules.find(mod => mod.order === order)
      const values = Object.assign({}, data)
      values.url = this.sanitizer.bypassSecurityTrustResourceUrl(values.tempUrl)
      this.currentModule = values
      this.activeNextModule()
      this.activeModuleFirebase()
    }, 2500)
  }

  activeModuleFirebase () {
    if (!this.currentModule.isView) {
      this.angularFireDatabase.list(`banco/users/${this.idUser}/modulesView`).push({
        key: this.currentModule.key
      })
    }
    this.notificationService.closeLoadingSwal()
  }

  startQuiz () {
    this.router.navigate(['take-exam/' + this.currentModule.key])
  }

}
