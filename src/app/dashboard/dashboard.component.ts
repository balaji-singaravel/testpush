import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControl, FormControlDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'mobile', 'gender', 'action'];
  dataSource: any;
  tabelData: any = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(public dialog: MatDialog,) { }
  openDialog() {
    const dia = this.dialog.open(dialog, {
      width: '600px',
      height: '600px'
    })
    dia.afterClosed().subscribe(data => {

      console.log('dia test', data)
      const formValue = data;
      // console.log(data,'line28')
      this.tabelData.push(formValue)
      console.log('datalist', this.tabelData)
      this.dataSource = new MatTableDataSource(this.tabelData);
      this.dataSource.paginator = this.paginator;
    })

  }


  ngOnInit(): void {

  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  startEdit(elment: any, i: any) {
    const se = this.dialog.open(dialog, {
      width: '30%',
      data: elment
    })
    se.afterClosed().subscribe(data => {

      // const formValue = data;
      console.log(data, 'edit profile')
      this.tabelData[i] = data
      console.log('datalist', this.tabelData)
      this.dataSource = new MatTableDataSource(this.tabelData);
      this.dataSource.paginator = this.paginator;
    })
  }


  deleteItem(i: any) {
    this.tabelData.splice(i, 1)
    this.dataSource = new MatTableDataSource(this.tabelData);
    this.dataSource.paginator = this.paginator;
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dashboard.component.scss']

})

export class dialog implements OnInit {
  userDetailsForm!: FormGroup;
  userListData: any = []
  actionBtn: string = "submit"
  // formGroup: any;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    public dialogRef: MatDialogRef<dialog>
  ) {
    console.log(editData, "ededed");
  }
  ngOnInit(): void {
    console.log(this.userListData, 'console')
    this.userDetailsForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[cat]+\\.[com]{3}$")]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', Validators.required]
    })

    if (this.editData) {
      this.actionBtn = "Update"
      this.userDetailsForm.controls['firstName'].setValue(this.editData.firstName);
      this.userDetailsForm.controls['lastName'].setValue(this.editData.lastName);
      this.userDetailsForm.controls['email'].setValue(this.editData.email);
      this.userDetailsForm.controls['mobile'].setValue(this.editData.mobile);
      this.userDetailsForm.controls['gender'].setValue(this.editData.gender)
    }
  }
  onSubmit() {
    if (this.userDetailsForm.valid) {
      this.dialogRef.close(this.userDetailsForm.value)
      // alert("form added successfully")
      this.userDetailsForm.reset();
    }


  }

}



