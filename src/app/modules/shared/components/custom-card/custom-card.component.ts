import { Component, OnInit, Input, EventEmitter, Output, QueryList, ViewChildren, AfterContentInit, AfterViewInit, ContentChildren, OnChanges, SimpleChanges } from '@angular/core';
import { rotatedState, disabledIconState, collapseCardState } from '../../animations/animations';

@Component({
  selector: 'custom-card',
  templateUrl: './custom-card.component.html',
  styleUrls: ['./custom-card.component.less'],
  animations: [
    rotatedState,
    collapseCardState,
    disabledIconState
  ]
})
export class CustomCardComponent implements OnInit, AfterViewInit, OnChanges {

  @ContentChildren(CustomCardComponent) panels: QueryList<CustomCardComponent>;
  @Input('id') id: string;
  @Input('icon-material-title') iconMaterialTitle: string;
  @Input('icon-awesome-title') iconAwesomeTitle: string;

  @Input('expandable') expandable: boolean = true;
  @Input('expan-async') expanAsync: boolean = false;
  @Output() onWaitExpand = new EventEmitter();
  @Output() onChangeCollapsed = new EventEmitter<boolean>();

  @Input('expanded-init') expandedInit: boolean = true;
  @Input('title') title: string;
  @Input('subtitle') subtitle: string = null;

  @Input('overflow-scroll') overflowScroll: boolean = true;

  @Input('header-clickable') headerClickable: boolean = true;
  @Input('disabled') disabled: boolean;
  @Input('searching') searching: boolean;
  @Input('collapsedCard') collapsedCard: boolean;

  waitExpand: boolean = false;
  public childrenCards: CustomCardComponent[];
  constructor() { }
  ngAfterViewInit() {
    if (this.panels)
      if (this.panels.length > 1) {
        this.childrenCards = this.panels.filter(a => a.id != this.id);
      }
  }
  ngOnInit() {
    this.collapsedCard = !this.expandedInit;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.disabled && changes.disabled.currentValue){
      if(changes.disabled.currentValue == true){
        this.collapsedCard = true;
      }
    }
  }
  public isOpen() {
    return !this.collapsedCard;
  }
  public hasChildren(): boolean {
    return this.panels.length > 1;
  }
  public getChildren(): CustomCardComponent[] {
    if (this.hasChildren())
      return this.panels.filter(a => a.id != this.id);
  }
  public expand(expand: boolean = true) {
    this.collapsedCard = !expand;
    this.waitExpand = false;
  }
  public toggleChild(idCard) {
    if (this.hasChildren()) {
      let card = this.getChildren().find(c => c.id == idCard);
      if (card)
        card.toggle();
    }

  }
  public toggle() {
    this.collapsedCard = !this.collapsedCard;
  }
  onClickButtonExpand() {
    if (!this.disabled && this.expandable && !this.waitExpand) {
      if (!this.expanAsync)
        this.collapsedCard = !this.collapsedCard
      else {
        if (this.collapsedCard) {
          this.waitExpand = true;
          this.onWaitExpand.emit();
        }
        else
          this.collapsedCard = true;

      }
      this.onChangeCollapsed.emit(this.collapsedCard);
    }
  }

}

