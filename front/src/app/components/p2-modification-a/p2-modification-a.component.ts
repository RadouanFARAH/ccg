import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router'
import { UpdatingService } from 'src/app/services/updating.service';

interface periodicity {
  value: string;
  viewValue: string;
}

interface natureClient {
  value: string;
  viewValue: string;
}

interface situationFamiliale {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-p2-modification-a',
  templateUrl: './p2-modification-a.component.html',
  styleUrls: ['./p2-modification-a.component.css']
})
export class P2ModificationAComponent implements OnInit {

  form: FormGroup;
  element: any;
  annexe: any;

  constructor(private _snackBar: MatSnackBar,private updatingService:UpdatingService,public route: Router, public fb: FormBuilder, public activeRoute: ActivatedRoute) {
    this.activeRoute.queryParams.subscribe((data) => {
      this.annexe = data.annexe;
      this.element = JSON.parse(data.element);
    })

    this.form = this.fb.group({
      identifiant_credit: [this.element.identifiant_credit, [Validators.required]],
      code_intervention: [this.element.code_intervention, [Validators.required]],
      denom_affaire: [this.element.denom_affaire, [Validators.required]],
      forme_juridique: [this.element.forme_juridique, [Validators.required]],
      ice: [this.element.ice, [Validators.required]],
      justif_formalisme_type: [this.element.justif_formalisme_type, [Validators.required]],
      justif_formalisme_n: [this.element.justif_formalisme_n, [Validators.required]],
      code_ville: [this.element.code_ville, [Validators.required]],
      code_secteur: [this.element.code_secteur, [Validators.required]],
      besoin_a_financer: [this.element.besoin_a_financer, [Validators.required]],
      motant_credit: [this.element.motant_credit, [Validators.required]],
      part_amc: [this.element.part_amc, [Validators.required]],
      part_ligne: [this.element.part_ligne, [Validators.required]],
      tx_int: [this.element.tx_int, [Validators.required]],
      duree_remb: [this.element.duree_remb, [Validators.required]],
      duree_differe: [this.element.duree_differe, [Validators.required]],
      periodicite_rembour: [this.element.periodicite_rembour, [Validators.required]],
      suretes: [this.element.suretes, [Validators.required]],
      cotation_score: [this.element.cotation_score, [Validators.required]],
      type_local: [this.element.type_local, [Validators.required]],
      appreciation_de_lactivite : [this.element.appreciation_de_lactivite , [Validators.required]],
      nombre_demploi_existant: [this.element.nombre_demploi_existant, [Validators.required]],
      nombre_demploi_a_creer: [this.element.nombre_demploi_a_creer, [Validators.required]],
      chiffre_daff: [this.element.chiffre_daff, [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  gotoHome(pageName: string): void {
    this.route.navigate([`${pageName}`], {queryParams:{annexe:this.annexe}})
  }

  update(){
    var data = this.form.value
    this.updatingService.update(data).subscribe((res)=>{
      console.log(res);
      this._snackBar.open("Mis à jour avec succès", "OK",{verticalPosition:"top", panelClass:"success"});
      this.gotoHome('home')
    },(err)=>{
      console.log(err);
      this._snackBar.open("Erreur, essayez plus tard", "OK",{verticalPosition:"top", panelClass:"error"});

    })
  }

}
