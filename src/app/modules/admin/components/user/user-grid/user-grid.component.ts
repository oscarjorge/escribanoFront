import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { User } from '../../../models/user.model';
@Component({
  selector: 'admin-user-grid',
  templateUrl: './user-grid.component.html',
  styleUrls: ['./user-grid.component.less']
})
export class UserGridComponent implements OnInit, OnChanges {

  @Input() items: User[];
  @Output() onEdit = new EventEmitter<User>();
  @Output() onDelete = new EventEmitter<User>();
  @Output() onForward = new EventEmitter<User>();
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  displayedColumns: string[] = ['photo', 'nickName', 'name', 'surname', 'mail', 'confirmed', 'active', 'roles', 'options'];
  dataSource: MatTableDataSource<User>;
  constructor() { }

  ngOnInit() {
    this.setDatasource(this.items);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.items){
      this.setDatasource(changes.items.currentValue);
    }

  }
  setDatasource(datasource){
    this.dataSource = new MatTableDataSource(datasource)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  edit(row: User){
    this.onEdit.emit(row);
  }
  delete(row: User){
    this.onDelete.emit(row);
  }
  forward(row: User){
    this.onForward.emit(row);
  }
}
