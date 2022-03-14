import { Gpio } from "../__mocks__/pigpio";
import run from "./invert";

const digitalSpy = jest.spyOn(Gpio.prototype, "digitalWrite");
const pwmSpy = jest.spyOn(Gpio.prototype, "pwmWrite");
it("Should write the correct values to the output pin", () => {
    run();
    // 1 for digital write, 2 for off()
    expect(digitalSpy).toHaveBeenCalledTimes(3);
    expect(pwmSpy).toHaveBeenCalledTimes(1);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(1);
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(1);
    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(102);
});
