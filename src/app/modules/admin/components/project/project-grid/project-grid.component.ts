import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Project } from '../../../models/project.model';
import * as moment from 'moment';
@Component({
  selector: 'admin-project-grid',
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.less']
})
export class ProjectGridComponent implements OnInit, OnChanges {

  @Input() items: Project[];
  @Output() onEdit = new EventEmitter<Project>();
  @Output() onDelete = new EventEmitter<Project>();
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static:false}) sort: MatSort;
  displayedColumns: string[] = ['idProject', 'description', 'projectNumber', 'startDate', 'endDate', 'projectManager', 'options'];
  dataSource: MatTableDataSource<Project>;
  moment = moment;
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
  delete(project: Project){
    this.onDelete.emit(project);
  }
  edit(project: Project){
    this.onEdit.emit(project);
  }
}
