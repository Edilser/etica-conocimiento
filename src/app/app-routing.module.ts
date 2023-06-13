import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { SessionGuard } from './session.guard';

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: 'management',
        loadChildren: () => import('./pages/management/management.module').then(m => m.ManagementModule),
        canActivate: [SessionGuard]
      },
      {
        path: 'view-module',
        loadChildren: () => import('./pages/view-module/view-module.module').then(m => m.ViewModuleModule),
        canActivate: [SessionGuard]
      },
      {
        path: 'take-exam',
        loadChildren: () => import('./pages/take-exam/take-exam.module').then(m => m.TakeExamModule),
        canActivate: [SessionGuard]
      },
      {
        path: 'results',
        loadChildren: () => import('./pages/result-exam/result-exam.module').then(m => m.ResultExamModule),
        canActivate: [SessionGuard]
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
      }
    ]
  },
  {
    path: "**",
    redirectTo: "dashboard"
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
