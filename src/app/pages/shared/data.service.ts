import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Data } from './data.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiPath: string = 'api/data';

  constructor(private http: HttpClient) {}

  /* traz todos os dados */
  getAll(): Observable<Data[]> {
    return this.http
      .get(this.apiPath)
      .pipe(catchError(this.handleError), map(this.jsonDataToAllData));
  }

  /* método que traz dado pelo id */
  getById(id: number): Observable<Data> {
    const url = `${this.apiPath}/${id}`;

    return this.http
      .get(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToData));
  }

  /* método de criação */
  create(data: Data): Observable<Data> {
    return this.http
      .post(this.apiPath, data)
      .pipe(catchError(this.handleError), map(this.jsonDataToData));
  }

  /* método de atualização */
  update(data: Data): Observable<Data> {
    const url = `${this.apiPath}/${data.id}`;

    return this.http.put(url, data).pipe(
      catchError(this.handleError),
      map(() => data)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  /* PRIVATE METHODS */

  /* adicionar o elementos no array */
  private jsonDataToAllData(jsonData: any[]): Data[] {
    const dados: Data[] = [];
    jsonData.forEach((element) => dados.push(element as Data));
    return dados;
  }

  private jsonDataToData(jsonData: any): Data {
    return jsonData as Data;
  }

  /* erros de requisição */
  private handleError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO =>', error);
    return throwError(error);
  }
}
