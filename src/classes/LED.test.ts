import LED from "./LED";
import { Gpio } from "../../__mocks__/pigpio";
import Animation from "./Animation";

jest.useFakeTimers();

const digitalSpy = jest.spyOn(Gpio.prototype, "digitalWrite");
const pwmSpy = jest.spyOn(Gpio.prototype, "pwmWrite");

/**
 * Helper function that allows for blackbox testing of writes to GPIO pins.
 * @param pin
 * @param value
 * @param invert
 */
function testBasicWrite(pin: number, value: number | boolean, invert: boolean) {
    const led = new LED(pin, invert);
    if (typeof value === "number") {
        led.write(value);
        if (invert) {
            value = 255 - value;
        }
        expect(digitalSpy).toHaveBeenCalledTimes(0);
        expect(pwmSpy).toHaveBeenCalledTimes(1);

        expect((pwmSpy.mock.instances[0] as any).pin).toEqual(pin);
        expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(value);
    } else {
        led.write(value);
        if (invert) {
            value = !value;
        }
        expect(digitalSpy).toHaveBeenCalledTimes(1);
        expect(pwmSpy).toHaveBeenCalledTimes(0);

        expect((digitalSpy.mock.instances[0] as any).pin).toEqual(pin);
        expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(value ? 1 : 0);
    }
    jest.clearAllMocks();
}

it("Does not allow pins less than 0.", () => {
    expect(() => {
        new LED(-2, false);
    }).toThrow(Error);
});

it("Writes the correct values on digital writes.", () => {
    testBasicWrite(11, true, false);
    testBasicWrite(13, true, false);
    testBasicWrite(13, false, false);
    testBasicWrite(14, true, false);
    testBasicWrite(16, false, false);
});

it("Writes the correct values on PWM writes.", () => {
    testBasicWrite(11, 50, false);
    testBasicWrite(13, 100, false);
    testBasicWrite(13, 115, false);
    testBasicWrite(14, 135, false);
    testBasicWrite(16, 200, false);
});

it("Does not allow pin IDs less than 0.", () => {
    expect(() => {
        testBasicWrite(-1, 50, false);
    }).toThrow(Error);
    expect(() => {
        testBasicWrite(-1, 0, false);
    }).toThrow(Error);
    expect(() => {
        testBasicWrite(-50, false, false);
    }).toThrow(Error);
    expect(() => {
        testBasicWrite(-1, true, false);
    }).toThrow(Error);
});

it("Does not allow PWM writes less than 0.", () => {
    testBasicWrite(1, -0, false);
    expect(() => {
        testBasicWrite(1, -1, false);
    }).toThrow(Error);
    expect(() => {
        testBasicWrite(1, -50, false);
    }).toThrow(Error);
    expect(() => {
        testBasicWrite(1, -256, false);
    }).toThrow(Error);
    expect(() => {
        testBasicWrite(1, -400, false);
    }).toThrow(Error);
});

it("Does not allow PWM writes greater than 255.", () => {
    expect(() => {
        testBasicWrite(1, 256, false);
    }).toThrow(Error);
    expect(() => {
        testBasicWrite(1, 300, false);
    }).toThrow(Error);
});

it("Properly inverts writes.", () => {
    testBasicWrite(1, 50, true);
    testBasicWrite(1, 255, true);
    testBasicWrite(1, 0, true);
    testBasicWrite(1, false, true);
    testBasicWrite(1, true, true);
});

it("Turns off all pins with off().", () => {
    const led = new LED(1, false);
    led.write(25);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    led.off();
    expect(digitalSpy).toHaveBeenCalledTimes(1);
    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(0);
    led.write(true);
    led.off();
    expect(digitalSpy).toHaveBeenCalledTimes(3);
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(0);
    led.off();
    expect(digitalSpy).toHaveBeenCalledTimes(4);
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(0);
});

it("Throws an error if you attempt to start an animation before setting one", () => {
    const led = new LED(1, false);
    expect(() => {
        led.startAnimation();
    }).toThrow(Error);
});

it("Starts animation automatically when no boolean is passed", () => {
    const led = new LED(1, false);
    // Timers run off of whole ms only. We must round for accurate results.
    const framerate = Math.floor((1 / 60) * 1000) / 1000;
    led.animate(
        new Animation((t: number) => {
            return ((t / 1000) * 2) % 1;
        }, framerate * 1000)
    );
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        led.stopAnimation();
    }, framerate * 3 * 1000);
    jest.runAllTimers();
});

it("Starts animation automatically when true is passed", () => {
    const led = new LED(1, false);
    // Timers run off of whole ms only. We must round for accurate results.
    const framerate = Math.floor((1 / 60) * 1000) / 1000;
    led.animate(
        new Animation((t: number) => {
            return ((t / 1000) * 2) % 1;
        }, framerate * 1000),
        true
    );
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        led.stopAnimation();
    }, framerate * 3 * 1000);
    jest.runAllTimers();
});

it("Starts animation when startAnimation() is called", () => {
    const led = new LED(1, false);
    // Timers run off of whole ms only. We must round for accurate results.
    const framerate = Math.floor((1 / 60) * 1000) / 1000;
    led.animate(
        new Animation((t: number) => {
            return ((t / 1000) * 2) % 1;
        }, framerate * 1000),
        false
    );
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        led.startAnimation();
        setTimeout(() => {
            expect(pwmSpy).toHaveBeenCalledTimes(3);
            led.stopAnimation();
        }, framerate * 3 * 1000);
    }, framerate * 3 * 1000);
    jest.runAllTimers();
});

it("Stops animation with stopAnimation()", () => {
    const led = new LED(1, false);
    // Timers run off of whole ms only. We must round for accurate results.
    const framerate = Math.floor((1 / 60) * 1000) / 1000;
    led.animate(
        new Animation((t: number) => {
            return ((t / 1000) * 2) % 1;
        }, framerate * 1000)
    );
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(digitalSpy).toHaveBeenCalledTimes(0);
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        led.stopAnimation();
        setTimeout(() => {
            expect(digitalSpy).toHaveBeenCalledTimes(0);
            expect(pwmSpy).toHaveBeenCalledTimes(3);
        }, framerate * 3 * 1000);
    }, framerate * 3 * 1000);
    jest.runAllTimers();
});

it("Stops animation with off()", () => {
    const led = new LED(1, false);
    // Timers run off of whole ms only. We must round for accurate results.
    const framerate = Math.floor((1 / 60) * 1000) / 1000;
    led.animate(
        new Animation((t: number) => {
            return ((t / 1000) * 2) % 1;
        }, framerate * 1000)
    );
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(digitalSpy).toHaveBeenCalledTimes(0);
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        led.off();
        setTimeout(() => {
            expect(digitalSpy).toHaveBeenCalledTimes(1);
            expect(pwmSpy).toHaveBeenCalledTimes(3);
        }, framerate * 3 * 1000);
    }, framerate * 3 * 1000);
    jest.runAllTimers();
});

it("Follows a provided animation curve", () => {
    const led = new LED(1, false);
    // Timers run off of whole ms only. We must round for accurate results.
    const framerate = Math.floor((1 / 60) * 1000) / 1000;
    led.animate(
        new Animation((t: number) => {
            return ((t / 1000) * 2) % 1;
        }, framerate * 1000)
    );
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        // 1/60s == 16ms, due to setTimeout() rounding down
        expect((pwmSpy.mock.calls[0] as any)[0]).toBeCloseTo(
            Math.round(framerate * 2 * 255)
        );
        expect((pwmSpy.mock.calls[1] as any)[0]).toBeCloseTo(
            Math.round(framerate * 4 * 255)
        );
        expect((pwmSpy.mock.calls[2] as any)[0]).toBeCloseTo(
            Math.round(framerate * 6 * 255)
        );
        led.stopAnimation();
    }, framerate * 3 * 1000);
    jest.runAllTimers();
});

it("Restarts animation where it left off with startAnimation()", () => {
    const led = new LED(1, false);
    // Timers run off of whole ms only. We must round for accurate results.
    const framerate = Math.floor((1 / 60) * 1000) / 1000;
    led.animate(
        new Animation((t: number) => {
            return ((t / 1000) * 2) % 1;
        }, framerate * 1000)
    );
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        expect((pwmSpy.mock.calls[0] as any)[0]).toBeCloseTo(
            Math.round(framerate * 2 * 255)
        );
        expect((pwmSpy.mock.calls[1] as any)[0]).toBeCloseTo(
            Math.round(framerate * 4 * 255)
        );
        expect((pwmSpy.mock.calls[2] as any)[0]).toBeCloseTo(
            Math.round(framerate * 6 * 255)
        );
        led.stopAnimation();
        setTimeout(() => {
            led.startAnimation();
            setTimeout(() => {
                expect(pwmSpy).toHaveBeenCalledTimes(8);
                expect((pwmSpy.mock.calls[3] as any)[0]).toBeCloseTo(
                    Math.round(framerate * 8 * 255)
                );
                expect((pwmSpy.mock.calls[4] as any)[0]).toBeCloseTo(
                    Math.round(framerate * 10 * 255)
                );
                expect((pwmSpy.mock.calls[5] as any)[0]).toBeCloseTo(
                    Math.round(framerate * 12 * 255)
                );
                expect((pwmSpy.mock.calls[6] as any)[0]).toBeCloseTo(
                    Math.round(framerate * 14 * 255)
                );
                expect((pwmSpy.mock.calls[7] as any)[0]).toBeCloseTo(
                    Math.round(framerate * 16 * 255)
                );
                led.stopAnimation();
            }, framerate * 1000 * 5);
        }, framerate * 1000 * 4);
    }, framerate * 1000 * 3);
    jest.runAllTimers();
});
