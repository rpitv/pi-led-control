import { Gpio } from "../__mocks__/pigpio";
import run from "./custom-animate";

jest.useFakeTimers();

const digitalSpy = jest.spyOn(Gpio.prototype, "digitalWrite");
const pwmSpy = jest.spyOn(Gpio.prototype, "pwmWrite");
it("Should write the correct values to the output pin", () => {
    run();
    jest.runAllTimers();

    // LED animation is turned off before it even draws its first frame.
    expect(digitalSpy).toHaveBeenCalledTimes(1);
    expect(pwmSpy).toHaveBeenCalledTimes(1);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(0);
    // Math.floor(16 / 400 * 255)
    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(10);
});
