import { Component, OnInit } from '@angular/core';

import { Data } from '../shared/data.model';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  dados: Data[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getAll().subscribe(
      (dados) => (this.dados = dados),
      (error) => alert('ERRO AO CARREGAR A LISTA')
    );
  }

  deleteData(data: any) {
    const mustDelete = confirm(
      'Atenção! Deseja prosseguir com a exclusão desse usuário? A ação não poderá ser desfeita.'
    );

    if (mustDelete) {
      this.dataService.delete(data.id).subscribe(
        () => (this.dados = this.dados.filter((element) => element != data)),
        () => alert('Erro ao tentar excluir')
      );
    }
  }
}
