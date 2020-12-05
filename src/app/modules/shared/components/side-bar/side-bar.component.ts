import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, OnChanges } from '@angular/core';
import { MenuService } from '../../../../services/menu/menu.service';
import { fadeIn, fadeOut } from '../../animations/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItemType, MenuItem } from '../../../../services/menu/menu-data';
@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.less'],
  host: {
    '(document:click)': 'handleClick($event)',
  },
  animations: [
    fadeIn,
    fadeOut
  ]
})
export class SideBarComponent implements OnInit {
  public elementRef;
  public filter:string='';
  menuItemType = MenuItemType;
  menu: any = {};
  @Output() clickOutput = new EventEmitter<boolean>();

  constructor(
    myElement: ElementRef,
    public menuService:MenuService,
    private route: ActivatedRoute,
    public router: Router,
  ) {
    this.elementRef = myElement;
    
  }

  ngOnInit(): void {
    this.menuService.buildMenu(false);
    this.route.paramMap.subscribe(params => {
      this.refresh(params.get('id'));
    });
    //Este evento salta cuando se hace un cambio de idioma
    this.menuService.changeMenu$.subscribe(menu=>{
      this.refresh(this.menu.id);
    })
  }
  navigateTo(event: Event, item: MenuItem, sidebar: boolean): void {
    if (item.type == this.menuItemType.Option) {
      this.router.navigateByUrl(item.url);
    } else {
      item.id = item.id || "0";
      this.refresh(item.id);
    }
  }
  upLevel(id){
    Object.assign(this.menu, this.menuService.getParent(id));
    this.menu.items.forEach(o => o.filter(this.filter));
  }
  private refresh(id?:any){
    Object.assign(this.menu, this.menuService.getMenu(id));
    if(this.menu.items)
     this.menu.items.forEach(o => o.filter(this.filter));
  }
  handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    let isHamburger= false;
   
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
       inside = true;
      }
      else{
        if (clickedComponent!=null && 
          (clickedComponent.parentNode!=null && clickedComponent.parentNode.classList && clickedComponent.parentNode.classList.contains('hamburger')) 
          || (clickedComponent.classList!=null && clickedComponent.classList.contains('hamburger')))
          isHamburger=true;
        }
        //En el caso de los items del side-bar con hijos el parent del elemento viene a null (supongo que porque están envueltos en un ng-container) pregunto pot la clase 'menu-type-0' para saber si son ellos
        if(clickedComponent.parentNode==null && clickedComponent.classList!=null && 
          (clickedComponent.classList.contains('menu-type-0') || clickedComponent.classList.contains('menu-type-1') || clickedComponent.classList.contains('folder'))){
          inside = true;
        }
        clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    
    if (!inside) 
      this.clickOutput.emit(isHamburger);
   
  }
  

}


