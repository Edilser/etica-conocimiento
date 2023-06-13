import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from 'src/app/services/api.service';

var misc: any = {
  sidebar_mini_active: true
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}
//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "/management",
    title: "Inicio",
    type: "link",
    icontype: "management"
  },
  {
    path: "/incidents",
    title: "Incidentes",
    type: "sub",
    icontype: "incidents",
    isCollapsed: true,
    children: [
      { path: "real-time", title: "Incidentes en tiempo real", type: "link" },
      { path: "history", title: "Historial de incidentes", type: "link" }
    ]
  },
  {
    path: "/risk-analysis",
    title: "Análisis de riesgos",
    type: "link",
    icontype: "risk-management"
  },
  {
    path: "/path-units",
    title: "Unidades en ruta",
    type: "link",
    icontype: "path-units"
  },
  {
    path: "/personnel-management",
    title: "Manejo de personal",
    type: "link",
    icontype: "personnel-management"
  },
  {
    path: "/human-resources",
    title: "Recursos Humanos",
    type: "link",
    icontype: "human-resources"
  },
  {
    path: "/activity",
    title: "Actividad",
    type: "link",
    icontype: "activity"
  },
  /* {
    path: "/dashboards",
    title: "Dashboards",
    type: "sub",
    icontype: "ni-shop text-primary",
    isCollapsed: true,
    children: [
      { path: "dashboard", title: "Dashboard", type: "link" },
      { path: "alternative", title: "Alternative", type: "link" }
    ]
  },
  {
    path: "/examples",
    title: "Examples",
    type: "sub",
    icontype: "ni-ungroup text-orange",
    collapse: "examples",
    isCollapsed: true,
    children: [
      { path: "pricing", title: "Pricing", type: "link" },
      { path: "login", title: "Login", type: "link" },
      { path: "register", title: "Register", type: "link" },
      { path: "lock", title: "Lock", type: "link" },
      { path: "timeline", title: "Timeline", type: "link" },
      { path: "profile", title: "Profile", type: "link" }
    ]
  },
  {
    path: "/components",
    title: "Components",
    type: "sub",
    icontype: "ni-ui-04 text-info",
    collapse: "components",
    isCollapsed: true,
    children: [
      { path: "buttons", title: "Buttons", type: "link" },
      { path: "cards", title: "Cards", type: "link" },
      { path: "grid", title: "Grid", type: "link" },
      { path: "notifications", title: "Notifications", type: "link" },
      { path: "icons", title: "Icons", type: "link" },
      { path: "typography", title: "Typography", type: "link" },
      {
        path: "multilevel",
        isCollapsed: true,
        title: "Multilevel",
        type: "sub",
        collapse: "multilevel",
        children: [
          { title: "Third level menu" },
          { title: "Just another link" },
          { title: "One last link" }
        ]
      }
    ]
  },
  {
    path: "/forms",
    title: "Forms",
    type: "sub",
    icontype: "ni-single-copy-04 text-pink",
    collapse: "forms",
    isCollapsed: true,
    children: [
      { path: "elements", title: "Elements", type: "link" },
      { path: "components", title: "Components", type: "link" },
      { path: "validation", title: "Validation", type: "link" }
    ]
  },
  {
    path: "/tables",
    title: "Tables",
    type: "sub",
    icontype: "ni-align-left-2 text-default",
    collapse: "tables",
    isCollapsed: true,
    children: [
      { path: "tables", title: "Tables", type: "link" },
      { path: "sortable", title: "Sortable", type: "link" },
      { path: "ngx-datatable", title: "Ngx Datatable", type: "link" }
    ]
  },
  {
    path: "/maps",
    title: "Maps",
    type: "sub",
    icontype: "ni-map-big text-primary",
    collapse: "maps",
    isCollapsed: true,
    children: [
      { path: "google", title: "Google Maps", type: "link" },
      { path: "vector", title: "Vector Map", type: "link" }
    ]
  },
  {
    path: "/widgets",
    title: "Widgets",
    type: "link",
    icontype: "ni-archive-2 text-green"
  },
  {
    path: "/charts",
    title: "Charts",
    type: "link",
    icontype: "ni-chart-pie-35 text-info"
  },
  {
    path: "/calendar",
    title: "Calendar",
    type: "link",
    icontype: "ni-calendar-grid-58 text-red"
  } */
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;
  ROUTES: RouteInfo[] = [];

  constructor(private router: Router,private ApiService: ApiService) {}

  ngOnInit() {
    this.ROUTES = [...this.ROUTES,
      {
        path: "/management",
        title: "Inicio",
        type: "link",
        icontype: "management"
      },
      {
        path: "/view-module/active",
        title: "Módulos",
        type: "link",
        icontype: "risk-management"
      },
      /* {
        path: "/take-exam/active",
        title: "Exámenes",
        type: "link",
        icontype: "incidents"
      }, */
      {
        path: "/results",
        title: "Resultados",
        type: "link",
        icontype: "activity"
      }
    ];
    this.generateRoutes();

    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }
  generateRoutes() {
    this.menuItems = this.ROUTES.filter(menuItem => menuItem);
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
