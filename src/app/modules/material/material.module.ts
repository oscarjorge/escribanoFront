import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatTooltipModule, MatDividerModule, MatBadgeModule, MatProgressBarModule, MatToolbarModule, MatTreeModule, MatSidenavModule, MatBottomSheetModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatExpansionModule, MatSliderModule, MatTabsModule, MatSelectModule,MatSlideToggleModule, MatChipsModule, MatButtonModule, MatCardModule,MatProgressSpinnerModule,  MatInputModule, MatMenuModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MAT_CHECKBOX_CLICK_ACTION, MatStepperModule, MAT_DATE_LOCALE} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatStepperModule,
    MatListModule
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    //OJO IMPORTANTE useUtc.
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500, horizontalPosition: 'center', verticalPosition: 'top' }},
    {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'noop'},
  ],
  exports:[
    MatListModule, MatTooltipModule, MatDividerModule, MatBadgeModule, MatProgressBarModule, MatToolbarModule, MatTreeModule, MatSidenavModule, MatBottomSheetModule, MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule,MatCardModule,MatExpansionModule,MatSliderModule,MatChipsModule, MatSelectModule, MatSlideToggleModule, MatTabsModule,MatButtonModule,MatProgressSpinnerModule,MatFormFieldModule, MatInputModule,MatSnackBarModule,MatDatepickerModule,
    MatMomentDateModule,
    MatMenuModule,MatCheckboxModule,MatIconModule, MatStepperModule
  ]
})
export class MaterialModule { }

