import { TestBed } from '@angular/core/testing';
import { ProfessionService } from './profession.service';
import { MessageService } from './message.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProfessionService', () => {
  let service: ProfessionService;
  let consoleErrSpy: jasmine.SpyObj<any>; //* Easier to use 'any' since it doesn't affect testing, and the real type is a bit complicated
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let httpTestController: HttpTestingController; //? Instead of a jasmineSpy, use this Ang built-in helper! 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ProfessionService, { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['send']) } ]
    }).compileComponents();

    httpTestController = TestBed.inject(HttpTestingController);
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>; //? Must cast inject()'s returned 'any' obj into our spy
    service = TestBed.inject(ProfessionService);
    consoleErrSpy = spyOn(console, 'error');
  })

  it('should be created', () => {
    const newService: ProfessionService = TestBed.inject(ProfessionService);
    expect(newService).toBeTruthy();
  });
  it('should get all professions from "/professions"', () => {
    service.getAllProfessions().subscribe(professionList => {
      expect(professionList.length).toBe(1);
      expect(professionList[0]).toEqual({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
    });
    service.getAllProfessions().subscribe(_ => { }); //* Failed to fetch the profession list
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(2); //* Called once per getAllProfessions() call

    const requestList = httpTestController.match('http://localhost:8080/professions'); //* Check if any requests made to '/professions'
    //* Success
    const successRequest = requestList[0];
    successRequest.flush([{ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }]); //* Stub in data to be returned
    expect(successRequest.request.method).toBe('GET');
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(3); //* Now called by tap() for a successful response

    //* Error case
    const errorRequest = requestList[1];
    errorRequest.flush('', { status: 403, statusText: 'Forbidden' });
    expect(consoleErrSpy).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(4); //* Finally called on catchError()
  })
  describe('should lookup professions based on a label parameter', () => {
    it('should return an empty array if the label is empty or blank', () => {
      service.searchProfessions('').subscribe(professionList => {
        expect(professionList.length).toBe(0); //! An empty search term still returns an empty array!
      });

      httpTestController.expectNone('http://localhost:8080/professions/?label=');
      expect(messageServiceSpy.send).toHaveBeenCalledTimes(0); //* No http call so no alert needed
    })
    it('should receive a profession list based on a "label" query parameter', () => {
      service.searchProfessions('Foobar').subscribe(professionList => {
        expect(professionList.length).toBe(1);
        expect(professionList[0]).toEqual({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
      });
      service.searchProfessions('Foobar').subscribe(_ => { }); //* Failed to lookup the professions
      expect(messageServiceSpy.send).toHaveBeenCalledTimes(0); //* Not called until either success or error thrown

      const requestList = httpTestController.match('http://localhost:8080/professions/?label=Foobar');
      //* Success
      const successRequest = requestList[0];
      successRequest.flush([{ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }]); //* Stub in data to be returned
      expect(successRequest.request.method).toBe('GET');
      expect(messageServiceSpy.send).toHaveBeenCalledTimes(1); //* ONLY called onSuccess tap() and onError

      //* Error case
      const errorRequest = requestList[1];
      errorRequest.flush('', { status: 403, statusText: 'Forbidden' });
      expect(consoleErrSpy).toHaveBeenCalledTimes(1); //* Error handler called
      expect(messageServiceSpy.send).toHaveBeenCalledTimes(2); //* Called onSuccess & now called onError
    })
  })
  it('should get a single profession from "/profession/{id}"', () => {
    service.getProfession('1').subscribe(profession => {
      expect(profession).toEqual({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
    })
    service.getProfession('1').subscribe(_ => { }); //* Failed to fetch the single profession
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(2); //* Called once per getProfession() call

    const requestList = httpTestController.match('http://localhost:8080/profession/1');
    //* Success
    const successRequest = requestList[0];
    successRequest.flush({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
    expect(successRequest.request.method).toBe('GET');
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(3); //* Now called by tap() onSuccess

    //* Error case
    const errorRequest = requestList[1];
    errorRequest.flush('', { status: 403, statusText: 'Forbidden' });
    expect(consoleErrSpy).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(4); //* Finally called by error handler
  })
  it('should try to add a new profession via "/professions/create"', () => {
    service.addProfession({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }).subscribe(profession => {
      expect(profession).toEqual({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
    })
    service.addProfession({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }).subscribe(_ => { })
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(2); //* Called once per addProfession() call

    const requestList = httpTestController.match('http://localhost:8080/professions/create');
    //* Success
    const successRequest = requestList[0];
    successRequest.flush({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
    expect(successRequest.request.method).toBe('POST');
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(3); //* Called onSuccess

    //* Error case
    const errorRequest = requestList[1];
    errorRequest.flush('', { status: 403, statusText: 'Forbidden' });
    expect(consoleErrSpy).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(4); //* Called by error handler
  })
  it('should try to update a new profession via "/profession/{id}"', () => {
    service.updateProfession('1', { observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }).subscribe(response => {
      expect(response).toEqual({ status: 200, statusText: 'OK' });
    })
    service.updateProfession('1', { observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' }).subscribe(_ => {});
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(2); //* Called once per updateProfession() call

    const requestList = httpTestController.match('http://localhost:8080/profession/1');
    //* Success
    const successRequest = requestList[0];
    successRequest.flush({ status: 200, statusText: 'OK' });
    expect(successRequest.request.method).toBe('PUT');
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(3); //* Called onSuccessful response

    //* Error case
    const errorRequest = requestList[1];
    errorRequest.flush('', { status: 403, statusText: 'Forbidden' });
    expect(consoleErrSpy).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(4); //* Called by error handler due to 403 response
  })
  it('should try to delete a new profession via "/profession/{id}"', () => {
    service.deleteProfession('1').subscribe(profession => { //* Successful delete
      expect(profession).toEqual({ observedOccupation: 'Foobar', serviceDiscipline: 'Barfoo' });
    })
    service.deleteProfession('1').subscribe(_ => { }); //* Failed delete
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(2); //* Called once per deleteProfession() call

    const requestList = httpTestController.match('http://localhost:8080/profession/1');
    //* Success
    const successRequest = requestList[0];
    successRequest.flush({ observedOccupation: "Foobar", serviceDiscipline: "Barfoo" });
    expect(successRequest.request.method).toBe('DELETE');
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(3); //* Called onSuccessful delete

    //* Error case
    const errorRequest = requestList[1];
    errorRequest.flush('', { status: 404, statusText: 'Not found' });
    expect(consoleErrSpy).toHaveBeenCalledTimes(1);
    expect(messageServiceSpy.send).toHaveBeenCalledTimes(4); //* Now that flush sent out error, catchError runs alert()
  })
  afterEach(() => {
    httpTestController.verify(); //* Very often helpful to double check no pending requests getting fired and being left unhandled
  })
});
