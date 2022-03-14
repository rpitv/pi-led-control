import { Gpio } from "../__mocks__/pigpio";
import run from "./basic-write-array";

const digitalSpy = jest.spyOn(Gpio.prototype, "digitalWrite");
const pwmSpy = jest.spyOn(Gpio.prototype, "pwmWrite");
it("Should write the correct values to the output pin", () => {
    run();
    expect(digitalSpy).toHaveBeenCalledTimes(6);
    expect(pwmSpy).toHaveBeenCalledTimes(3);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(1);
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(1);
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(1);
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[4] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[5] as any)[0]).toEqual(0);
    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(255);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(128);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(40);
});
