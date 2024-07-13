import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Observable, of, catchError, tap } from "rxjs";
import { type Profession } from "./models/Profession";
import { MessageService } from "./services/message.service";
import { environment } from "environments/environment";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({ // ?: Marks the class to be injected as a dependency for some other component
  providedIn: "root" // ?: Ensures that entire app can use it (from root and beyond)
}) // ?: Additionally, it can also receive other components as dependencies
export class ProfessionService {
  // - In local dev, must have local version of server running in background to serve up data
  private HOST = environment.apiHost || "http://localhost:8080";
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  getAllProfessions() {
    this.alert("Loading profession data");

    return this.http.get<Profession[]>(`${this.HOST}/professions`).pipe(
      tap({ next: () => this.alert("Successfully loaded all profession data") }),
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
  // TODO: Decide what's normal/abnormal for the server to return for "Add/Update/Delete"
  // so catchError can better tailor its message for the view to display
  addProfession(profession: Profession) {
    this.alert("Attempting to add new profession data point");

    const endpoint = `${this.HOST}/professions/create`;
    return this.http.post<Profession>(endpoint, profession, httpOptions).pipe(
      tap({ next: () =>
        this.alert(
          `Adding profession with occupation=${profession.observedOccupation}` +
          ` and discipline=${profession.serviceDiscipline}`
        )
      }),
      catchError(this.handleHttpError("Adding a new profession"))
    );
  }
  updateProfession(id: string, profession: Profession) {
    this.alert("Attempting to update this profession data");

    return this.http.put<void>(`${this.HOST}/profession/${id}`, profession, httpOptions).pipe(
      tap({ next: () => this.alert(`Updated profession with id: ${profession._id}`) }),
      catchError(this.handleHttpError("Updating the profession"))
    );
  }
  deleteProfession(id: string) {
    this.alert("Attempting to delete this profession data");

    const endpoint = `${this.HOST}/profession/${id}`;
    return this.http.delete<Profession>(endpoint, httpOptions).pipe(
      tap({ next: () => this.alert(`Deleted profession with id: ${id}`) }),
      catchError(this.handleHttpError("Deleting the profession"))
    );
  }

  // ?: Handles failed HTTP operations in `catchError()` by providing a fallback value
  private handleHttpError<T = undefined>(operation = "operation", fallbackVal?: T) {
    // ?: Ang HttpClient ONLY defines HttpErrorResponse as a wrapper for ALL errors (I THINK)
    // ?: SO it's probably safe to use for the returned func + might make it reusable across the app
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(error); // - Instead of logging externally, logging to console works for now

      // ?: Thanks to HttpErrorResponse, should be safe to use status for a good alert message
      let alertMessage = `Sorry! ${operation} failed due to `;
      if (error.status >= 500) {
        alertMessage += "a server issue";
      }
      else if (error.status >= 400) {
        alertMessage += "an issue with your request";
      }
      else {
        alertMessage += "an unknown issue";
      }
      this.alert(alertMessage);
      // TODO: Could split log in two, 1. For User-Friendly alerts. 2. For Remote Debug Logs

      return of(fallbackVal as T); // ?: `as` INTENTIONALLY insists to TS that T CAN BE `undefined`
    };
  }

  // - Display a user-friendly message to help the user understand something went wrong
  private alert(message: string) {
    this.messageService.send(`Profession: ${message}`);
  }
}
