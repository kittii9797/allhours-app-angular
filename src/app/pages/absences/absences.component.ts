import { Component, OnInit } from '@angular/core';
import { Absence, AbsenceRequest } from '../../models/absence';
import { AbsenceDefinition } from '../../models/absence-definition';
import { AppService } from '../../services/AppService.service';
import { TOKEN } from '../../utils/constants';

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
})
export class AbsencesComponent implements OnInit {

  public absences!: Absence[];
  public absenceDefinitions!: AbsenceDefinition[];
  public absence!: Absence;
  public isLoading: boolean = true;
  private isAbsencesLoaded: boolean = false;
  private isDefinitionsLoaded: boolean = false;

  public absenceRequest: AbsenceRequest = {
    AbsenceDefinition: null,
    Comment: '',
    PartialTimeFrom: new Date(),
    PartialTimeTo: new Date()
  };

  constructor(private appService: AppService) { }

  ngOnInit(): void {
    this.getAbsenceDefinitions();
    this.getAbsences();
  }

  private checkLoadingStatus() {
    this.isLoading = !(this.isAbsencesLoaded && this.isDefinitionsLoaded);
  }

  public editAbsenceInfo() {
    this.absence.AbsenceDefinitionId = this.absenceRequest.AbsenceDefinition?.Id;
    this.absence.AbsenceDefinitionName = this.absenceRequest.AbsenceDefinition?.AbsenceDefinitionName;
    this.absence.OverrideHolidayAbsence = true;
    this.absence.Comment = this.absenceRequest.Comment;

    this.appService.editAbsence(this.absence).subscribe(ab => this.getAbsences());
    const closeModal = document.getElementById("close") as HTMLButtonElement;
    closeModal.click();
  }

  public absenceUser(absence: Absence) {
    this.absence = absence;
  }

  private getAbsences() {
    if (localStorage.getItem(TOKEN)) {
      this.appService.getAbsences().subscribe(absences => {
        this.absences = absences;
        this.isAbsencesLoaded = true;
        this.checkLoadingStatus();
      });
    }
  }

  private getAbsenceDefinitions() {
    this.appService.getAbsenceDefinitions().subscribe(absenceDefinitions => {
      this.absenceDefinitions = absenceDefinitions.map(ad => {
        const absenceDefinition: AbsenceDefinition = { Id: ad.Id, AbsenceDefinitionName: ad.Name };
        return absenceDefinition;
      });
      this.isDefinitionsLoaded = true;
      this.checkLoadingStatus();
    });
  }
}
