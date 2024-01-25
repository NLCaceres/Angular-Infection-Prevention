import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, of, catchError, tap } from "rxjs";
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

  getAllProfessions() {
    this.alert('Loading profession data');

    return this.http.get<Profession[]>(`${this.HOST}/professions`).pipe(
      tap({ next: () => this.alert('Successfully loaded all profession data') }),
      catchError(this.handleHttpError<Profession[]>("Getting the list of professions", []))
    );
  }
  getProfession(id: string) {
    this.alert(`Loading profession data with id: ${id}`);

    return this.http.get<Profession>(`${this.HOST}/profession/${id}`).pipe(
      tap({ next: () => this.alert(`Successfully loaded profession with id: ${id}`) }),
      catchError(this.handleHttpError(`Getting profession info with id: ${id}`))
    );
  }
  searchProfessions(term: string) {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Profession[]>(`${this.HOST}/professions/?label=${term}`).pipe(
      tap({ next: () => this.alert(`Found profession matching '${term}'`) }),
      catchError(this.handleHttpError<Profession[]>("Looking up the profession", []))
    );
  }
  //TODO: Check what's considered normal/abnormal for add/update/delete to get from the server so catchError can send a proper fallback for the view to handle
  addProfession(profession: Profession) {
    this.alert('Attempting to add new profession data point');

    const endpoint = `${this.HOST}/professions/create`;
    return this.http.post<Profession>(endpoint, profession, httpOptions).pipe(
      tap({ next: () => this.alert(`Adding profession with occupation=${profession.observedOccupation} and discipline=${profession.serviceDiscipline}`) }),
      catchError(this.handleHttpError("Adding a new profession"))
    );
  }
  updateProfession(id: string, profession: Profession) {
    this.alert('Attempting to update this profession data');

    return this.http.put<void>(`${this.HOST}/profession/${id}`, profession, httpOptions).pipe(
      tap({ next: () => this.alert(`Updated profession with id: ${profession._id}`) }),
      catchError(this.handleHttpError("Updating the profession"))
    );
  }
  deleteProfession(id: string) {
    this.alert('Attempting to delete this profession data');

    const endpoint = `${this.HOST}/profession/${id}`;
    return this.http.delete<Profession>(endpoint, httpOptions).pipe(
      tap({ next: () => this.alert(`Deleted profession with id: ${id}`) }),
      catchError(this.handleHttpError("Deleting the profession"))
    );
  }

  //? Use in catchError() to handle failed HTTP operations w/out crashing the app PLUS return a fallback value if needed!
  private handleHttpError<T = undefined>(operation = 'operation', fallbackVal?: T) {
    //? Angular HttpClient ONLY defines HttpErrorResponse as a wrapper for all errors (I THINK), so it should be safe to coerce the caughtError into that type
    return (error: HttpErrorResponse): Observable<T> => { //? PLUS it might make this func reusable across the app
      console.error(error); //* Logging to console works for now!

      //? Since Angular/Http wraps its errors in HttpErrorResponse, it should also be safe to use status to determine a good alert message to show the user
      let alertMessage = `Sorry! ${operation} failed due to `;
      if (error.status >= 500) { 
        alertMessage += 'a server issue';
      }
      else if (error.status >= 400) {
        alertMessage += 'an issue with your request';
      }
      else {
        alertMessage += 'an unknown issue';
      }
      this.alert(alertMessage);
      //todo Could divide the logging in two, one to print user friendly alerts WHILE the other sends to remote logs for debugging

      return of(fallbackVal as T); //? Using `as` insists to Typescript that T can possibly INTENTIONALLY be type `undefined`
    };
  }

  private alert(message: string) { //* Alert prints a user friendly message so they have a basic understanding that something went wrong
    this.messageService.send(`Profession: ${message}`);
  }
}
