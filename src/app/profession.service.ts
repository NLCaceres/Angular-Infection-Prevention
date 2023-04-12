import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Profession } from "./Profession";
import { MessageService } from "./message.service";
import { environment } from "environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({ //? Marks the class to be injected as a dependency for some other component
  providedIn: "root" //? Ensures that entire app can use it (from root and beyond)
}) //? Additionally, it can also receive other components as dependencies
export class ProfessionService {
  //* In local dev, must have local version of server running in background to serve up data
  private HOST = environment.apiHost || "http://localhost:8080";
  private http = inject(HttpClient);
  private messageService = inject(MessageService)

  getAllProfessions(): Observable<Profession[]> {
    this.alert('Loading profession data');

    return this.http.get<Profession[]>(`${this.HOST}/professions`).pipe(
      tap(_ => this.alert('Successfully loaded all profession data')),
      catchError(this.handleError<Profession[]>('getAllProfessions', []))
    );
  }
  getProfession(id: string): Observable<Profession> {
    this.alert(`Loading profession data with id: ${id}`);

    return this.http.get<Profession>(`${this.HOST}/profession/${id}`).pipe(
      tap(_ => this.alert(`Successfully loaded profession with id: ${id}`)),
      catchError(this.handleError<Profession>(`getProfession id=${id}`))
    );
  }
  searchProfessions(term: string): Observable<Profession[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http
      .get<Profession[]>(`${this.HOST}/professions/?label=${term}`)
      .pipe(
        tap(_ => this.alert(`Found profession matching '${term}'`)),
        catchError(this.handleError<Profession[]>('searchProfessions', []))
      );
  }
  addProfession(profession: Profession): Observable<Profession> {
    this.alert('Attempting to add new profession data point');

    const endpoint = `${this.HOST}/professions/create`;
    return this.http.post<Profession>(endpoint, profession, httpOptions).pipe(
      tap(_ =>
        this.alert(
          `Adding profession with occupation=${profession.observedOccupation} and discipline=${profession.serviceDiscipline}`
        )
      ),
      catchError(this.handleError<any>('addProfession', profession))
    );
  }
  updateProfession(id: string, profession: Profession): Observable<any> {
    this.alert('Attempting to update this profession data');

    return this.http
      .put<void>(`${this.HOST}/profession/${id}`, profession, httpOptions)
      .pipe(
        tap(_ => this.alert(`Updated profession with the following id: ${profession._id}`)),
        catchError(this.handleError<any>('updateProfession'))
      );
  }
  deleteProfession(id: string) { //? Prefer implicit returns?
    this.alert('Attempting to delete this profession data');

    const endpoint = `${this.HOST}/profession/${id}`;
    return this.http.delete<Profession>(endpoint, httpOptions).pipe(
      tap(_ => this.alert(`Deleted profession with id: ${id}`)),
      catchError(this.handleError<Profession>('deleteProfession'))
    );
  }

  //? Use in catchError() to handle failed HTTP operations w/out crashing the Ang app
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      //todo send error.message to remote logging infrastructure
      console.error(error); //* Logging to console works for now!

      let alertMessage = `${operation} failed `
      switch (error.name) {
        case 'HttpErrorResponse':
          alertMessage += 'to retrieve a response from server'
      }
      this.alert(alertMessage);

      return of(result as T); //* By returning an empty result, the app keeps running!
    };
  }

  //todo Could divide the logging in two, one to print user friendly alerts WHILE the other sends to remote logs for debugging
  private alert(message: string) { //* Alert prints a user friendly message so they have a basic understanding that something went wrong
    this.messageService.send(`Profession: ${message}`);
  }
}
