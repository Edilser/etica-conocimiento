import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-take-exam',
  templateUrl: './take-exam.component.html',
  styleUrls: ['./take-exam.component.scss']
})
export class TakeExamComponent implements OnInit {
  idUser = ''
  idModule = ''
  userExams = []
  currentModule: any = {}
  currentQuiz: any = null
  textQuiz = 'Empezar evaluación'
  start = false
  viewResults = false
  questionsForm = this.fb.array([])
  timeStartText = ''
  timeFinishedText = ''
  timeFinished = ''
  timeStart = moment()
  timeUsed = ''
  textQualification = ''
  constructor(
    private notificationService: NotificationService,
    private angularFireDatabase: AngularFireDatabase,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getUserData()
    this.getQuestions()
  }

  getUserData () {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'))
      this.idUser = user.idUser
      this.idModule = this.route.snapshot.paramMap.get('id');
      if (this.idModule) {
        this.getExams()
      } else {
        this.router.navigate(['/management'])
      }
    }
  }

  getExams () {
    this.angularFireDatabase.object(`banco/users/${this.idUser}/exams`).query.once('value').then(res => {
      if (res.val()) {
        const key = Object.keys(res.val())
        this.userExams = key.map(keyValue => {
          return {
            ...res.val()[keyValue],
            keyQuiz: keyValue
          }
        })
        if (this.userExams.length === 0) {
          this.textQuiz = 'Empezar evaluación'
        }
      }
      this.getModules()
    })
  }

  getModules () {
    this.notificationService.showLoadingSwal('Obteniendo modulos', 'Por favor espere un momento...')
    this.angularFireDatabase.object(`banco/modules/${this.idModule}`).query.once('value').then(res => {
      if (res.val()) {
        this.currentModule = {
          ...res.val(),
          key: this.idModule
        }
        this.currentQuiz =  this.userExams.find(exam => exam.key === this.idModule) || null
        if (this.currentQuiz && this.currentQuiz.intents > 0) {
          this.textQuiz = 'Reintentar evaluación'
        }
        this.notificationService.closeLoadingSwal()
      } else {
        this.notificationService.closeLoadingSwal()
        this.notificationService.showSwal('Módulo no encontrado', '', 'error')
        setTimeout(() => {
          this.router.navigate(['/management'])
        }, 4000);
      }
    })
    .catch(() => {
      this.notificationService.closeLoadingSwal()
      this.notificationService.showSwal('OPcurrió un invonceniento al obtener los datos', '', 'error')
    })
  }

  getTime () {
    return moment().locale('es').format('dddd, DD [de] MMMM [de] YYYY, h:mm A')
  }

  startQuiz () {
    this.start = true
    this.timeStartText = this.getTime()
    this.timeStart = moment(new Date())
  }

  getQuestions () {
    this.angularFireDatabase.object(`banco/questions/${this.idModule}/detail`).query.once('value').then(res => {
      if (res.val()) {
        const questions = Object.keys(res.val())
        const data = questions.map(question => {
          return {
            ...res.val()[question],
            key: question,
            answers: this.getOnlyAnswers(res.val()[question].answers)
          }
        })
        const dataOrder = this.sortQuestions(data)
        this.setDataArrayForm(dataOrder)
      }
    })
  }

  sortQuestions (data: Array<any>): Array<any> {
    return data.sort(() => Math.random() - 0.5)
  }

  getOnlyAnswers (answers: Array<string>) {
    return answers.reduce((acc, data, index) => {
      if (data) acc.push({key: index, answer: data })
      return acc
    }, [])
  }

  setDataArrayForm (data: Array<any>) {
    data.map((infoQuestion, index) => {
      this.questionsForm.push(
        this.fb.group({
          question: infoQuestion.question,
          order: infoQuestion.order,
          key: infoQuestion.key,
          correctAnswer: infoQuestion.correctAnswer,
          answers: this.fb.array([]),
          answerSelected: [null, [Validators.required]]
        })
      )
      this.getAnswersArrayForm(infoQuestion.answers, index)
    })
  }

  getAnswersArrayForm (answers: Array<any>, index) {
    return answers.map(info => {
      this.frmInputsAnswers(index).push(
        this.fb.group({
          key: info.key,
          answer: info.answer
        })
      )
    })
  }

  frmInputsAnswers (index) : FormArray {
    return this.questionsForm.controls[index].get('answers') as FormArray;
  }

  frmInputsExisting () : FormArray {
    return this.questionsForm as FormArray;
  }

  finishedQuestions () {
    const timeFinished = moment(new Date());
    this.timeFinishedText = this.getTime()
    this.timeUsed = this.getRangeDate(timeFinished, this.timeStart)
    
    const results = this.questionsForm.value.reduce((acc, data, index) => {
      if (index === 0) {
        acc['valid'] = 0
        acc['invalid'] = 0
      }
      if (data.answerSelected === data.correctAnswer) acc['valid'] = acc.valid + 1;
      else acc['invalid'] = acc.invalid + 1;
      return acc;
    }, {})
    this.setQualification(results)
  }

  getRangeDate (dateTime: any, initDate: any) {
    const current = dateTime;
    const base = initDate
    const diff_minutes = current.diff(base, 'minutes');
    const time = moment.duration(diff_minutes, 'minutes');
    const days = time.days();
    const hours = time.hours();
    const minutes = time.minutes();
  
    if (days === 0 && hours === 0 && minutes === 0) { // seconds
      const diff_seconds = current.diff(base, 'seconds');
      const timeSeconds = moment.duration(diff_seconds, 'seconds');
      const seconds = timeSeconds.seconds();
      const secondsText = seconds >= 1 ? `${seconds} segundos` : '';
      const range = secondsText;
  
      return range;
    } else { // days, hours, minutes
      const daysText = days > 1 ? `${days} días ` : days !== 0 ? `${days} día ` : '';
      const hoursText = hours > 1 ? `${hours} horas ` : hours !== 0 ? `${hours} hora ` : '';
      const minutesText = minutes > 1 ? `${minutes} minutos ` : minutes !== 0 ? `${minutes} minuto ` : '';

      const diff_seconds = current.diff(base, 'seconds');
      const timeSeconds = moment.duration(diff_seconds, 'seconds');
      const seconds = timeSeconds.seconds();
      const secondsText = seconds >= 1 ? `${seconds} segundos` : '';

      const range = `${daysText}${hoursText}${minutesText}${secondsText}`;
  
      return range;
    }
  };

  setQualification (data: any) {
    const totalQuestions = this.questionsForm.value.length
    const percent = (data.valid / totalQuestions) * 100;
    this.textQualification = `${data.valid} de ${totalQuestions} (${percent}%)`
    this.viewResults = true
    this.saveInformation(percent, data)
  }

  close () {
    this.router.navigate(['/management'])
  }

  saveInformation (percent, results) {
    if (this.currentQuiz && this.currentQuiz.intents > 0) {
      this.angularFireDatabase.list(`banco/users/${this.idUser}/exams`)
        .update(this.currentQuiz.keyQuiz, {
          intents: this.currentQuiz.intents + 1,
          result: percent > 79 ? true : false
        })
    } else {
      this.angularFireDatabase.list(`banco/users/${this.idUser}/exams`).push({
        key: this.currentModule.key,
        intents: 1,
        result: percent > 79 ? true : false
      })
    }
    this.angularFireDatabase.list(`banco/users/${this.idUser}/exam-results`).push({
      startTime: this.timeStartText,
      endTime: this.timeFinishedText,
      timeUsed: this.timeUsed,
      qualification: this.textQualification,
      wrong: results.invalid,
      right: results.valid,
      result: percent > 79 ? true : false,
      percent,
      module: this.currentModule.title
    })
  }
}
