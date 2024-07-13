import { TestBed } from "@angular/core/testing";
import { ProfessionService } from "./profession.service";
import { MessageService } from "./services/message.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withFetch } from "@angular/common/http";

describe("ProfessionService", () => {
  let service: ProfessionService;
  let consoleErrMock: jest.Mock;
  let messageServiceMock: jest.Mock;
  let httpTestController: HttpTestingController; // ?: A built-in Ang helper to mock request data

  beforeEach(async () => {
    messageServiceMock = jest.fn();
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        ProfessionService, { provide: MessageService, useValue: { send: messageServiceMock } },
        provideHttpClient(withFetch()), provideHttpClientTesting()
      ]
    }).compileComponents();

    httpTestController = TestBed.inject(HttpTestingController);
    TestBed.inject(MessageService);
    service = TestBed.inject(ProfessionService);
    consoleErrMock = jest.fn();
    console.error = consoleErrMock;
  });

  it("should be created", () => {
    const newService: ProfessionService = TestBed.inject(ProfessionService);
    expect(newService).toBeTruthy();
  });
  it("should get all professions from \"/professions\"", () => {
    // - WHEN `getAllProfessions` succeeds
    service.getAllProfessions().subscribe(professionList => {
      // - THEN it'll receive 1 Profession with the following prop data
      expect(professionList.length).toBe(1);
      expect(professionList[0]).toEqual(
        { observedOccupation: "Foobar", serviceDiscipline: "Barfoo" }
      );
    });
    service.getAllProfessions().subscribe(() => { }); // - This call will fail later

    // - The MessageServiceMock gets called once for each `getAllProfessions` subscription
    expect(messageServiceMock).toHaveBeenCalledTimes(2);

    // - Use `match(requestURL)` to check for requests made to that URL
    const requestList = httpTestController.match("http://localhost:8080/professions");

    // - 1st subscription receives the following stubbed data
    const successRequest = requestList[0];
    successRequest.flush([{ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" }]);
    expect(successRequest.request.method).toBe("GET");
    // - AND WHEN httpTestController sends the above response, THEN `tap()` calls the messageService
    expect(messageServiceMock).toHaveBeenCalledTimes(3);

    // - 2nd subscription receives the following error status
    const errorRequest = requestList[1];
    errorRequest.flush("", { status: 403, statusText: "Forbidden" });
    expect(consoleErrMock).toHaveBeenCalledTimes(1);
    // - AND THEN `catchError()` will send an applicable human-readable error message
    expect(messageServiceMock).toHaveBeenCalledTimes(4); // - By calling the MessageService
  });
  describe("should lookup professions based on a label parameter", () => {
    it("should return an empty array if the label is empty or blank", () => {
      service.searchProfessions("").subscribe(professionList => {
        // - WHEN an empty search term is used, THEN an empty array is returned
        expect(professionList.length).toBe(0);
      });

      httpTestController.expectNone("http://localhost:8080/professions/?label=");
      // - BUT no actual http call made for empty search terms
      expect(messageServiceMock).toHaveBeenCalledTimes(0); // - AND no alert needed
    });
    it("should receive a profession list based on a \"label\" query parameter", () => {
      // - WHEN `searchProfessions` succeeds
      service.searchProfessions("Foobar").subscribe(professionList => {
        // - THEN it'll receive 1 Profession with the following prop data
        expect(professionList.length).toBe(1);
        expect(professionList[0]).toEqual(
          { observedOccupation: "Foobar", serviceDiscipline: "Barfoo" }
        );
      });
      service.searchProfessions("Foobar").subscribe(() => { }); // - This sub will fail later

      // - WHEN neither a successful or error response received, THEN don't call the message service
      expect(messageServiceMock).toHaveBeenCalledTimes(0);

      const requestList = httpTestController.match(
        "http://localhost:8080/professions/?label=Foobar"
      );
      // - On Success, httpTestController will send the following response data
      const successRequest = requestList[0];
      successRequest.flush([{ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" }]);
      expect(successRequest.request.method).toBe("GET");
      // - AND `tap()` will call the message service
      expect(messageServiceMock).toHaveBeenCalledTimes(1);

      // - On error, the httpTestController will send the following error status
      const errorRequest = requestList[1];
      errorRequest.flush("", { status: 403, statusText: "Forbidden" });
      // - AND an error will be logged to the console
      expect(consoleErrMock).toHaveBeenCalledTimes(1);
      // - AND the message service will run an error alert visible to the user
      expect(messageServiceMock).toHaveBeenCalledTimes(2);
    });
  });
  it("should get a single profession from \"/profession/{id}\"", () => {
    // - WHEN `getProfession` succeeds
    service.getProfession("1").subscribe(profession => {
      // - THEN the following mock response will be received
      expect(profession).toEqual({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" });
    });
    service.getProfession("1").subscribe(() => { }); // - This sub will fail later

    // - MessageService called for every getProfession sub
    expect(messageServiceMock).toHaveBeenCalledTimes(2);

    const requestList = httpTestController.match("http://localhost:8080/profession/1");
    // - On Success, the following response data will be sent
    const successRequest = requestList[0];
    successRequest.flush({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" });
    expect(successRequest.request.method).toBe("GET");
    // - AND THEN `tap()` will call the message service
    expect(messageServiceMock).toHaveBeenCalledTimes(3);

    // - On Error, the following error response is sent
    const errorRequest = requestList[1];
    errorRequest.flush("", { status: 403, statusText: "Forbidden" });
    // - AND the error is logged AND message service sends an error alert to the user
    expect(consoleErrMock).toHaveBeenCalledTimes(1);
    expect(messageServiceMock).toHaveBeenCalledTimes(4);
  });
  it("should try to add a new profession via \"/professions/create\"", () => {
    service.addProfession({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" })
      .subscribe(profession => {
        expect(profession).toEqual({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" });
      });
    service.addProfession({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" })
      .subscribe(() => { });

    // - Message Service called for every new `addProfession()` sub
    expect(messageServiceMock).toHaveBeenCalledTimes(2);

    const requestList = httpTestController.match("http://localhost:8080/professions/create");
    // - On Success, THEN the following response data is returned
    const successRequest = requestList[0];
    successRequest.flush({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" });
    expect(successRequest.request.method).toBe("POST");
    // - AND THEN the message service will be called
    expect(messageServiceMock).toHaveBeenCalledTimes(3);

    // - On error, THEN the following error status will be returned
    const errorRequest = requestList[1];
    errorRequest.flush("", { status: 403, statusText: "Forbidden" });
    // - AND THEN, the error will be logged and displayed to the user via Message Service
    expect(consoleErrMock).toHaveBeenCalledTimes(1);
    expect(messageServiceMock).toHaveBeenCalledTimes(4);
  });
  it("should try to update a new profession via \"/profession/{id}\"", () => {
    service.updateProfession("1", { observedOccupation: "Foobar", serviceDiscipline: "Barfoo" })
      .subscribe(response => {
        expect(response).toEqual({ status: 200, statusText: "OK" });
      });
    service.updateProfession("1", { observedOccupation: "Foobar", serviceDiscipline: "Barfoo" })
      .subscribe(() => { });

    // - The Message Service is called for every `updateProfession()` sub
    expect(messageServiceMock).toHaveBeenCalledTimes(2);

    const requestList = httpTestController.match("http://localhost:8080/profession/1");
    // - On Success, THEN the following 200 status code is returned
    const successRequest = requestList[0];
    successRequest.flush({ status: 200, statusText: "OK" });
    expect(successRequest.request.method).toBe("PUT");
    // - AND THEN, the Message Service is called
    expect(messageServiceMock).toHaveBeenCalledTimes(3);

    // - On error, THEN the following error status code is returned
    const errorRequest = requestList[1];
    errorRequest.flush("", { status: 403, statusText: "Forbidden" });
    // - AND THEN, the error is logged and displayed to the user
    expect(consoleErrMock).toHaveBeenCalledTimes(1);
    expect(messageServiceMock).toHaveBeenCalledTimes(4);
  });
  it("should try to delete a new profession via \"/profession/{id}\"", () => {
    // - WHEN `deleteProfession` succeeds
    service.deleteProfession("1").subscribe(profession => {
      // - THEN the following data is returned
      expect(profession).toEqual({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" });
    });
    service.deleteProfession("1").subscribe(() => { }); // - Will fail to delete later

    // - The Message service will be called for every `deleteProfession()` sub
    expect(messageServiceMock).toHaveBeenCalledTimes(2);

    const requestList = httpTestController.match("http://localhost:8080/profession/1");
    // - On success, THEN the following response will be returned
    const successRequest = requestList[0];
    successRequest.flush({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" });
    expect(successRequest.request.method).toBe("DELETE");
    // - AND THEN, the Message Service will be called
    expect(messageServiceMock).toHaveBeenCalledTimes(3);

    // - On error, THEN the following error status will be returned
    const errorRequest = requestList[1];
    errorRequest.flush("", { status: 404, statusText: "Not found" });
    // - AND THEN, the error will be logged and Message Service will display it to the user
    expect(consoleErrMock).toHaveBeenCalledTimes(1);
    expect(messageServiceMock).toHaveBeenCalledTimes(4);
  });
  afterEach(() => {
    // - Using `verify()` on the HttpTestController helps double check no requests were left pending
    httpTestController.verify(); // - and forgotten/unhandled
  });
});
