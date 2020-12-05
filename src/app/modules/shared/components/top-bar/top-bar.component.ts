import { Component, Input, ViewChild, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.less'],
  encapsulation: ViewEncapsulation.None,
  host: { 'class': 'main' }
})
export class TopBarComponent {
  @ViewChild('hamburger', {static:false}) hamburger: ElementRef;

  @Input() text: string;
  sidebarActive:boolean=false;
  picture:any;
  constructor(private renderer: Renderer2, private el: ElementRef, private authService: AuthService) {
    authService.changeUser$.subscribe(user=>{
      this.picture = user.picture || '/assets/images/man-user.png';

    });
    this.picture = authService.user.picture || '/assets/images/man-user.png';
  }

  clickHamburger() {

    if (this.hamburger.nativeElement.classList.contains('active')){
      this.sidebarActive = false;
      this.renderer.removeClass(this.hamburger.nativeElement, 'active');
    }
    else{
      this.sidebarActive = true;
      this.renderer.addClass(this.hamburger.nativeElement, 'active');
    }
  }
  clickSideBarOutput(e){
    if(e==false){
      if (this.hamburger.nativeElement.classList.contains('active')){
        this.sidebarActive = false;
        this.renderer.removeClass(this.hamburger.nativeElement, 'active');
      }
    }
  }
  logOut(){
    this.authService.logout();
  }


}

