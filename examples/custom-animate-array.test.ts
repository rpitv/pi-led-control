import { Gpio } from "../__mocks__/pigpio";
import run from "./custom-animate-array";

jest.useFakeTimers();

const digitalSpy = jest.spyOn(Gpio.prototype, "digitalWrite");
const pwmSpy = jest.spyOn(Gpio.prototype, "pwmWrite");
it("Should write the correct values to the output pin", () => {
    run();
    jest.runAllTimers();

    // LED animation is turned off before it even draws its first frame.
    expect(digitalSpy).toHaveBeenCalledTimes(3);
    expect(pwmSpy).toHaveBeenCalledTimes(3);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(0);

    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(130);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(130);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(134);
});
