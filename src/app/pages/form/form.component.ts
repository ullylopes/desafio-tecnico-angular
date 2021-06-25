import { Component, OnInit, AfterContentChecked } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Data } from '../shared/data.model';
import { DataService } from '../shared/data.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit, AfterContentChecked {
  form!: FormGroup;
  submittingForm: boolean = false;
  currentAction!: string;
  pageTitle!: string;
  serverErrorMessages: string[] = [];

  /* carregamento do objeto rastreado pelo currentAction */
  data: Data = new Data();

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildDataForm();
    this.loadData();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  onSubmit() {
    this.submittingForm = true;

    if (this.currentAction == 'new') {
      this.createData();
    } else {
      this.updateData();
    }
  }

  /* define a ação do formulário */
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildDataForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(4)]],
      occupation: [null, [Validators.required, Validators.minLength(4)]],
      weight: [null, [Validators.required, Validators.minLength(2)]],
      age: [null, [Validators.required, Validators.minLength(2)]],
      city: [null, [Validators.required, Validators.minLength(2)]],
      birthday: [null, [Validators.required]],
    });
  }

  private loadData() {
    if (this.currentAction == 'edit') {
      this.route.paramMap
        .pipe(
          switchMap((params: Params) =>
            this.dataService.getById(+params.get('id'))
          )
        )
        .subscribe(
          (data) => {
            this.data = data;
            this.form.patchValue(this.data);
          },
          (error) => alert('Ocorreu um erro no servidor, tente mais tarde!')
        );
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de usuário';
    } else {
      const dataName = this.data.name || '';
      this.pageTitle = 'Editando informações: ' + dataName;
    }
  }

  createData() {
    const data: Data = Object.assign(new Data(), this.form.value);

    this.dataService.create(data).subscribe(
      (data) => this.actionsForSuccess(data),
      (error) => this.actionsforError(error)
    );
  }

  private updateData() {}

  private actionsForSuccess(data: Data) {
    alert('Solicitação processada com sucesso!');

    this.router
      .navigateByUrl('pages', { skipLocationChange: true })
      .then(() => this.router.navigate(['pages', data.id, 'edit']));
  }

  private actionsforError(error: any) {
    alert('Ocorreu um erro ao processar sua solicitação!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = [
        'Falha na comunicação com o servidor. Tente mais tarde!',
      ];
    }
  }

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get occupation(): FormControl {
    return this.form.get('occupation') as FormControl;
  }

  get weight(): FormControl {
    return this.form.get('weight') as FormControl;
  }

  get age(): FormControl {
    return this.form.get('age') as FormControl;
  }

  get city(): FormControl {
    return this.form.get('city') as FormControl;
  }

  get birthday(): FormControl {
    return this.form.get('birthday') as FormControl;
  }
}
