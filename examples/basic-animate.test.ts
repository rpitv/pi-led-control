import { Gpio } from "../__mocks__/pigpio";
import run from "./basic-animate";

const digitalSpy = jest.spyOn(Gpio.prototype, "digitalWrite");
const pwmSpy = jest.spyOn(Gpio.prototype, "pwmWrite");
it("Should write the correct values to the output pin", () => {
    run();
    // LED animation is turned off before it even draws its first frame.
    expect(digitalSpy).toHaveBeenCalledTimes(2);
    expect(pwmSpy).toHaveBeenCalledTimes(0);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(1);
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(0);
});
