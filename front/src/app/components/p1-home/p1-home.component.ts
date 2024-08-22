import { query } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router'
import { DownloadService } from 'src/app/services/download.service';
import { ReceivingService } from 'src/app/services/receiving.service';
import { RefreshingService } from 'src/app/services/refreshing.service';
import { SendingService } from 'src/app/services/sending.service';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

interface product {
  value: string;
  viewValue: string;
  titleValue: string;
}

@Component({
  selector: 'app-p1-home',
  templateUrl: './p1-home.component.html',
  styleUrls: ['./p1-home.component.css']
})
export class P1HomeComponent implements OnInit {
  modeselect = null
  annexe: any = "";
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public dataSource4: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: any = ['identifiant_credit', 'status', 'options']
  public displayedColumns4: any = ['identifiant_credit', 'status', 'options']
  pageSizeOptions = [5, 8, 10];
  display: string = 'none';
  url = environment.url
  constructor(private downloads: DownloadService,public route: Router, private cdr: ChangeDetectorRef, private _snackBar: MatSnackBar, private sendingService: SendingService, private receivingService: ReceivingService, private refreshingService: RefreshingService, public activeRoute: ActivatedRoute) {
    this.activeRoute.queryParams.subscribe((data) => {
      this.modeselect = data.annexe;
    })
    this.getRecieved()
    this.getSent()

  }
  sentFiles =[]
  getSent(){
    this.downloads.getSent().subscribe({next:(files:any)=>{
      this.sentFiles = files
    }, error:(err)=>{
      alert(err)
    }})
  }
  recievedFiles =[]
  getRecieved(){
    this.downloads.getRecieved().subscribe({next:(files:any)=>{
      this.recievedFiles = files
    }, error:(err)=>{
      alert(err)
    }})
  }
  download(folder,filename) {
      this.downloads
        .download(folder+'/'+filename)
        .subscribe(blob => saveAs(blob, filename))
  }
  ngOnInit(): void {
    // this.actualiser()
  }
  progress = 0

  generating = false
  genererAnnexe() {
    setInterval(() => {
      this.progress++
    }, 900);
    this.generating = true
    console.log(this.generating);

    this.receivingService.genererAnnexe({ data: "data" }).subscribe((res: any) => {
      this.generating = false
      if (res.error) {
        this._snackBar.open("ERROR, essayer encore", "OK", { verticalPosition: "top", panelClass: "error" });
      } else if (res.message) {
        this._snackBar.open("Annexe 1 et 4 sont déjà generés", "OK", { verticalPosition: "top", panelClass: "success" });
      } else {
        this._snackBar.open("generé avec succés", "OK", { verticalPosition: "top", panelClass: "success" });
        this.actualiser()
      }
    }, (err) => {
      this.generating = false
      this._snackBar.open("ERROR, essayer encore", "OK", { verticalPosition: "top", panelClass: "error" });
    })
  }
  deposerAnnexe() {
    this.sendingService.deposerAnnexe({ data: "data" }).subscribe((res: any) => {
      if (res.error) {
        this._snackBar.open("ERROR, essayer encore", "OK", { verticalPosition: "top", panelClass: "error" });
      } else if (res.message) {
        this._snackBar.open("Déja déposé", "OK", { verticalPosition: "top", panelClass: "error" });
      } else {
        this._snackBar.open("Déposé avec succés", "OK", { verticalPosition: "top", panelClass: "success" });
      }
    }, (err) => {
      this._snackBar.open("ERROR, essayer encore", "OK", { verticalPosition: "top", panelClass: "error" });
    })
  }


  actualiser() {
    this.refreshingService.actualiser({ data: "data" }).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res.contrats_1)
      this.dataSource4 = new MatTableDataSource(res.contrats_4)
      setTimeout(() => {
        this.display = 'initial';
        this.cdr.detectChanges();
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource4.sort = this.sort;
        this.dataSource4.paginator = this.paginator;
      }, 1995);
    }, (err) => {
      console.log(err);
    })
  }

  gotoDetails(element) {
    this.route.navigate(['modification-a'], { queryParams: { annexe: this.modeselect, element: JSON.stringify(element) } })
  }

  selectionChanged(number) {
    this.modeselect = number
    console.log(this.modeselect, this.dataSource, this.dataSource4);

  }


  gotoLogout(): void {
    localStorage.removeItem('token')
    this.route.navigate(['login'])
  }
}
