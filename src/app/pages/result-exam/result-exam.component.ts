import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-result-exam',
  templateUrl: './result-exam.component.html',
  styleUrls: ['./result-exam.component.scss']
})
export class ResultExamComponent implements OnInit {

  exams = []
  idUser = ''
  constructor(
    private notificationService: NotificationService,
    private angularFireDatabase: AngularFireDatabase
  ) { }

  ngOnInit() {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      this.idUser = user.idUser
      this.getResults()
    }
  }


  getResults () {
    this.notificationService.showLoadingSwal('Obteniendo resultados', '')
    this.angularFireDatabase.list(`banco/users/${this.idUser}/exam-results`).query.once('value').then(res => {
      if (res.val()) {
        const keys = Object.keys(res.val())
        this.exams = keys.map(element => res.val()[element])
      }
      this.notificationService.closeLoadingSwal()
    })
  }

}
