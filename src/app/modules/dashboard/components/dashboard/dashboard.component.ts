import { Component, ViewEncapsulation, OnChanges, OnInit } from '@angular/core';

import { MenuService } from '../../../../services/menu/menu.service';
import { fadeIn, fadeOut, slideIn, fadeInOut } from '../../../shared/animations/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MenuItemType } from '../../../../services/menu/menu-data';
import { Location } from '@angular/common';
declare let $;

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'dashboard-container' },
  animations: [
    fadeIn,
    fadeOut,
    fadeInOut
  ]
})

export class DashboardComponent implements OnInit {
  breadcrumbs: Array<MenuItem> = [];
  public filter: string = '';
  menuItemType = MenuItemType;
  item: any = {};

  constructor(
    public menuService: MenuService,
    private route: ActivatedRoute,
    public router: Router,
    public location: Location,
  ) {
  }
  ngOnInit() {
    this.menuService.buildMenu(false);
    this.route.paramMap.subscribe(params => {
      this.refresh(params.get('id'));
    });
    //Este evento salta cuando se hace un cambio de idioma
    this.menuService.changeMenu$.subscribe(menu=>{
      this.refresh(this.item.id);
    })

  }
  navigateTo(event: Event, item: MenuItem, sidebar: boolean): void {
    if (item.type == this.menuItemType.Option) {
      this.router.navigateByUrl(item.url);
    } else {
      item.id = item.id || "0";
      this.location.go(`/dashboard/${item.id}`);
      this.refresh(item.id);
    }
  }
  private setBreadcrumbs(): void {
    let _breadcrumbs: Array<MenuItem> = [this.item];
    let _parent: MenuItem = (this.item || { parent: null }).parent;
    while (!!_parent) {
      _breadcrumbs.push(_parent);
      _parent = _parent.parent;
    }
    this.breadcrumbs = (_breadcrumbs || []).reverse();
  }
  private refresh(id?:any){
      Object.assign(this.item, this.menuService.getMenu(id));
      this.setBreadcrumbs();
      if(this.item!=null && this.item.items!=null)
        this.item.items.forEach(o => o.filter(this.filter));
  }
}
