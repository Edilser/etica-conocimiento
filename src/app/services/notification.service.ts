import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showToast(title, message, type, icon = "ni-bell-55") {
    this.toastr.show(
      `<span class="alert-icon ni ${icon}" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">${title}</span> <span data-notify="message">${message}</span></div>`,
      "",
      {
        timeOut: 8000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-right",
        toastClass: `ngx-toastr alert alert-dismissible alert-${type} alert-notify`,
      }
    );
  }

  showLoadingSwal(title: string, text: string, allowBackdrop = true) {
    swal.fire({
      title: title,
      text: text,
      allowOutsideClick: allowBackdrop,
      allowEscapeKey: allowBackdrop,
      allowEnterKey: allowBackdrop,
    });
    swal.showLoading();
  }

  showSwal(title: string, text: string, swalType: string) {
    const style = swalType === 'error' ? 'danger' : swalType;
    swal.fire({
      title: title,
      text: text,
      buttonsStyling: false,
      confirmButtonClass: "btn btn-" + style,
      type: swalType as any,
    });
  }

  showSwalButtonConfirm(title: string, text: string, textBtnConfirm: string, textBtnCancel:string, colorBtnConfirm: string, colorBtnCancel: string) {
    return swal.fire({
      title: title,
      text: text,
      type: 'question',
      confirmButtonText: textBtnConfirm,
      confirmButtonColor: colorBtnConfirm,
      cancelButtonText: textBtnCancel,
      cancelButtonColor: colorBtnCancel,
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    })
  }

  closeLoadingSwal() {
    swal.close();
  }
}
