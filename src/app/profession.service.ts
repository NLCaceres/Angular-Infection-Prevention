import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { Profession } from "./Profession";
import { MessageService } from "./message.service";

// ! Not certain the reason for it
// ! But it seems to at least be a way for the server to identify what it's receiving
// ! Currently no extra settings for the server to get
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

// * The injectable decorator marks a class as a participant
// * in the dependency injection system (provides/injects dependencies for something else)
// ! It can even have it's own dependencies
@Injectable({
  providedIn: "root" // ! Ensures that entire app can use it (from root and beyond)
})
export class ProfessionService {
  // * This here is for later when I create routes in Express
  private HOST = "https://safe-retreat-87739.herokuapp.com/api/";

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getAllProfessions(): Observable<Profession[]> {
    this.messageService._message.next(
      "Loading Profession Information: All Professions Fetched"
    );
    return this.http.get<Profession[]>(`${this.localHost}professions`).pipe(
      tap(_ => this.log("Fetched all professions from DB")),
      catchError(this.handleError<Profession[]>("getAllProfessions", []))
    );
  }
  getProfession(id: string): Observable<Profession> {
    this.messageService._message.next(
      "Loading Profession Information: This Profession Fetched"
    );
    return this.http.get<Profession>(`${this.localHost}profession/${id}`).pipe(
      tap(_ => this.log(`Fetched Profession with id: ${id}`)),
      catchError(this.handleError<Profession>(`getProfession id=${id}`))
    );
  }
  searchProfessions(term: string): Observable<Profession[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http
      .get<Profession[]>(`${this.localHost}professions/?label=${term}`)
      .pipe(
        tap(_ => this.log(`Found Profession Matching "${term}"`)),
        catchError(this.handleError<Profession[]>("searchProfessions", []))
      );
  }
  addProfession(profession: Profession): Observable<Profession> {
    this.messageService._message.next(
      "Loading Profession Information: Added this new Profession"
    );

    const endpoint = `${this.localHost}professions/create`;
    return this.http.post<Profession>(endpoint, profession, httpOptions).pipe(
      tap(_ =>
        this.log(
          `Adding Profession with occupation=${
            profession.observed_occupation
          } and discipline=${profession.service_discipline}`
        )
      ),
      catchError(this.handleError<any>(`addProfession`, profession))
    );
  }
  updateProfession(id: string, profession: Profession): Observable<any> {
    this.messageService._message.next(
      "Loading Profession Information: This Profession Updated"
    );
    return this.http
      .put<void>(`${this.localHost}profession/${id}`, profession, httpOptions)
      .pipe(
        tap(_ => this.log(`Updated Profession id=${profession._id}`)),
        catchError(this.handleError<any>(`updateProfession`))
      );
  }
  deleteProfession(id: string) {
    this.messageService._message.next(
      "Loading Profession Information: This Profession Deleted"
    );
    const endpoint = `${this.localHost}profession/${id}`;
    return this.http.delete<Profession>(endpoint, httpOptions).pipe(
      tap(_ => this.log(`Deleted profession with id: ${id}`)),
      catchError(this.handleError<Profession>(`deleteProfession`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService._message.next(`HeroService: ${message}`);
  }
}
