import { TestBed } from "@angular/core/testing";
import { MessageService } from "./message.service";

describe("MessageService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => { // - Easy simple sanity check for TestBed
    const service: MessageService = TestBed.inject(MessageService);
    expect(service).toBeTruthy();
  });
  it("should send any messages submitted to its subscribers", () => {
    const service: MessageService = TestBed.inject(MessageService);
    service.message$.subscribe(message => expect(message).toBe("Hello world!"));
    service.send("Hello world!");
  });
});
