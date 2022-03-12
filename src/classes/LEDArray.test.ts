import LEDArray from "./LEDArray";
import { Gpio } from "../../__mocks__/pigpio";
import Animation from "./Animation";

jest.useFakeTimers();

const digitalSpy = jest.spyOn(Gpio.prototype, "digitalWrite");
const pwmSpy = jest.spyOn(Gpio.prototype, "pwmWrite");

it("Allows construction without the invert argument", () => {
    new LEDArray([1, 2, 3]);
    new LEDArray([1, 2, 3]);
    new LEDArray([4, 5, 6, 7]);
    new LEDArray([8]);
    new LEDArray([9, 10]);
});

it("Requires the length of the invert array to be equal to the number of pins", () => {
    expect(() => {
        new LEDArray([1, 2, 3], []);
    }).toThrow(Error);
    expect(() => {
        new LEDArray([1, 2, 3], [false]);
    }).toThrow(Error);
    expect(() => {
        new LEDArray([1, 2, 3], [false, true]);
    }).toThrow(Error);
    expect(() => {
        new LEDArray([1, 2, 3], [false, true, true, false]);
    }).toThrow(Error);
    new LEDArray([1, 2, 3], [false, true, true]);
});

it("Does not allow pins less than 0", () => {
    expect(() => {
        new LEDArray([1, -2, 3]);
    }).toThrow(Error);
    expect(() => {
        new LEDArray([-1, 2, 3]);
    }).toThrow(Error);
    expect(() => {
        new LEDArray([-1, -2, -3]);
    }).toThrow(Error);
});

it("Requires write arrays to have the same size as the number of LEDs", () => {
    const leds = new LEDArray([4, 5, 6]);
    expect(() => {
        leds.write(false, false);
    }).toThrow(Error);
    expect(() => {
        leds.write(false, true, true, true);
    }).toThrow(Error);
    expect(() => {
        leds.write(34, 59, 100, 241);
    }).toThrow(Error);
    expect(() => {
        leds.write(34, 59);
    }).toThrow(Error);
    leds.write(34, 59, 100);
    leds.write(false, true, true);
});

it("Requires write arrays to all be of the same type", () => {
    const leds = new LEDArray([4, 5, 6]);
    expect(() => {
        // @ts-ignore Intentional test
        leds.write(false, 15, true);
    }).toThrow(Error);
    expect(() => {
        // @ts-ignore Intentional test
        leds.write(15, 15, true);
    }).toThrow(Error);
});

it("Does not allow PWM writes less than 0", () => {
    const leds = new LEDArray([4, 5, 6]);
    expect(() => {
        leds.write(0, -5, 0);
    }).toThrow(Error);
    expect(() => {
        leds.write(-1, 0, 0);
    }).toThrow(Error);
    expect(() => {
        leds.write(0, 0, -0.0001);
    }).toThrow(Error);
    leds.write(-0, 0, 0);
    leds.write(0, 0, 0);
});

it("Does not allow PWM writes greater than 255", () => {
    const leds = new LEDArray([4, 5, 6, 7]);
    expect(() => {
        leds.write(0, 345, 0, 0);
    }).toThrow(Error);
    expect(() => {
        leds.write(1, 0, 256, 58);
    }).toThrow(Error);
    expect(() => {
        leds.write(0, 0, 255.0001, 128);
    }).toThrow(Error);
    leds.write(0, 255, 0, 0);
    leds.write(255, 255, 255, 255);
});

it("Sends writes to the relevant pins", () => {
    const leds = new LEDArray([58, 3, 135, 1, 18, 4, 5]);
    const pwmVals = [11, 16, 13, 38, 31, 3, 15];
    const digitalVals = [true, true, false, true, false, false, true];

    expect(pwmSpy).toHaveBeenCalledTimes(0);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...pwmVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...digitalVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(7);

    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(pwmVals[0]);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(pwmVals[1]);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(pwmVals[2]);
    expect((pwmSpy.mock.calls[3] as any)[0]).toEqual(pwmVals[3]);
    expect((pwmSpy.mock.calls[4] as any)[0]).toEqual(pwmVals[4]);
    expect((pwmSpy.mock.calls[5] as any)[0]).toEqual(pwmVals[5]);
    expect((pwmSpy.mock.calls[6] as any)[0]).toEqual(pwmVals[6]);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(
        digitalVals[0] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(
        digitalVals[1] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(
        digitalVals[2] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(
        digitalVals[3] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[4] as any)[0]).toEqual(
        digitalVals[4] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[5] as any)[0]).toEqual(
        digitalVals[5] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[6] as any)[0]).toEqual(
        digitalVals[6] ? 1 : 0
    );
});

it("Does not invert writes when no invert argument is passed", () => {
    const leds = new LEDArray([58, 3, 135, 1, 18, 4, 5]);
    const pwmVals = [11, 16, 13, 38, 31, 3, 15];
    const digitalVals = [true, true, false, true, false, false, true];

    expect(pwmSpy).toHaveBeenCalledTimes(0);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...pwmVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...digitalVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(7);

    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(pwmVals[0]);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(pwmVals[1]);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(pwmVals[2]);
    expect((pwmSpy.mock.calls[3] as any)[0]).toEqual(pwmVals[3]);
    expect((pwmSpy.mock.calls[4] as any)[0]).toEqual(pwmVals[4]);
    expect((pwmSpy.mock.calls[5] as any)[0]).toEqual(pwmVals[5]);
    expect((pwmSpy.mock.calls[6] as any)[0]).toEqual(pwmVals[6]);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(
        digitalVals[0] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(
        digitalVals[1] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(
        digitalVals[2] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(
        digitalVals[3] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[4] as any)[0]).toEqual(
        digitalVals[4] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[5] as any)[0]).toEqual(
        digitalVals[5] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[6] as any)[0]).toEqual(
        digitalVals[6] ? 1 : 0
    );
});

it("Does not invert writes when a false invert argument is explicitly passed", () => {
    const leds = new LEDArray([58, 3, 135, 1, 18, 4, 5], false);
    const pwmVals = [11, 16, 13, 38, 31, 3, 15];
    const digitalVals = [true, true, false, true, false, false, true];

    expect(pwmSpy).toHaveBeenCalledTimes(0);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...pwmVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...digitalVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(7);

    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(pwmVals[0]);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(pwmVals[1]);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(pwmVals[2]);
    expect((pwmSpy.mock.calls[3] as any)[0]).toEqual(pwmVals[3]);
    expect((pwmSpy.mock.calls[4] as any)[0]).toEqual(pwmVals[4]);
    expect((pwmSpy.mock.calls[5] as any)[0]).toEqual(pwmVals[5]);
    expect((pwmSpy.mock.calls[6] as any)[0]).toEqual(pwmVals[6]);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(
        digitalVals[0] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(
        digitalVals[1] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(
        digitalVals[2] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(
        digitalVals[3] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[4] as any)[0]).toEqual(
        digitalVals[4] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[5] as any)[0]).toEqual(
        digitalVals[5] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[6] as any)[0]).toEqual(
        digitalVals[6] ? 1 : 0
    );
});

it("Properly inverts writes when a singular invert boolean is passed", () => {
    const leds = new LEDArray([58, 3, 135, 1, 18, 4, 5], true);
    const pwmVals = [11, 16, 13, 38, 31, 3, 15];
    const digitalVals = [true, true, false, true, false, false, true];

    expect(pwmSpy).toHaveBeenCalledTimes(0);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...pwmVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...digitalVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(7);

    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(255 - pwmVals[0]);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(255 - pwmVals[1]);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(255 - pwmVals[2]);
    expect((pwmSpy.mock.calls[3] as any)[0]).toEqual(255 - pwmVals[3]);
    expect((pwmSpy.mock.calls[4] as any)[0]).toEqual(255 - pwmVals[4]);
    expect((pwmSpy.mock.calls[5] as any)[0]).toEqual(255 - pwmVals[5]);
    expect((pwmSpy.mock.calls[6] as any)[0]).toEqual(255 - pwmVals[6]);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(
        !digitalVals[0] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(
        !digitalVals[1] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(
        !digitalVals[2] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(
        !digitalVals[3] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[4] as any)[0]).toEqual(
        !digitalVals[4] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[5] as any)[0]).toEqual(
        !digitalVals[5] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[6] as any)[0]).toEqual(
        !digitalVals[6] ? 1 : 0
    );
});

it("Properly inverts writes when an array of invert booleans is passed", () => {
    const leds = new LEDArray(
        [58, 3, 135, 1, 18, 4, 5],
        [true, false, true, true, false, false, true]
    );
    const pwmVals = [11, 16, 13, 38, 31, 3, 15];
    const digitalVals = [true, true, false, true, false, false, true];

    expect(pwmSpy).toHaveBeenCalledTimes(0);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...pwmVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.write(...digitalVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(7);

    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(255 - pwmVals[0]);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(pwmVals[1]);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(255 - pwmVals[2]);
    expect((pwmSpy.mock.calls[3] as any)[0]).toEqual(255 - pwmVals[3]);
    expect((pwmSpy.mock.calls[4] as any)[0]).toEqual(pwmVals[4]);
    expect((pwmSpy.mock.calls[5] as any)[0]).toEqual(pwmVals[5]);
    expect((pwmSpy.mock.calls[6] as any)[0]).toEqual(255 - pwmVals[6]);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(
        !digitalVals[0] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(
        digitalVals[1] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(
        !digitalVals[2] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(
        !digitalVals[3] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[4] as any)[0]).toEqual(
        digitalVals[4] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[5] as any)[0]).toEqual(
        digitalVals[5] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[6] as any)[0]).toEqual(
        !digitalVals[6] ? 1 : 0
    );
});

it("Turns off all LEDs with off()", () => {
    const leds = new LEDArray([58, 3, 135, 1, 18, 4, 5], false);
    const pwmVals = [11, 16, 13, 38, 31, 3, 15];
    const digitalVals = [true, true, false, true, false, false, true];

    expect(pwmSpy).toHaveBeenCalledTimes(0);
    expect(digitalSpy).toHaveBeenCalledTimes(0);
    leds.off();
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    expect(digitalSpy).toHaveBeenCalledTimes(7);
    leds.write(...pwmVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(7);
    leds.write(...digitalVals);
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(14);
    leds.off();
    expect(pwmSpy).toHaveBeenCalledTimes(7);
    expect(digitalSpy).toHaveBeenCalledTimes(21);

    expect((pwmSpy.mock.calls[0] as any)[0]).toEqual(pwmVals[0]);
    expect((pwmSpy.mock.calls[1] as any)[0]).toEqual(pwmVals[1]);
    expect((pwmSpy.mock.calls[2] as any)[0]).toEqual(pwmVals[2]);
    expect((pwmSpy.mock.calls[3] as any)[0]).toEqual(pwmVals[3]);
    expect((pwmSpy.mock.calls[4] as any)[0]).toEqual(pwmVals[4]);
    expect((pwmSpy.mock.calls[5] as any)[0]).toEqual(pwmVals[5]);
    expect((pwmSpy.mock.calls[6] as any)[0]).toEqual(pwmVals[6]);

    expect((digitalSpy.mock.calls[0] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[1] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[2] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[3] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[4] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[5] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[6] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[7] as any)[0]).toEqual(
        digitalVals[0] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[8] as any)[0]).toEqual(
        digitalVals[1] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[9] as any)[0]).toEqual(
        digitalVals[2] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[10] as any)[0]).toEqual(
        digitalVals[3] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[11] as any)[0]).toEqual(
        digitalVals[4] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[12] as any)[0]).toEqual(
        digitalVals[5] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[13] as any)[0]).toEqual(
        digitalVals[6] ? 1 : 0
    );
    expect((digitalSpy.mock.calls[14] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[15] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[16] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[17] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[18] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[19] as any)[0]).toEqual(0);
    expect((digitalSpy.mock.calls[20] as any)[0]).toEqual(0);
});

it("Requires animation arrays to be of the same length as there are LEDs", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate([
        new Animation(100, (t) => t / 400),
        new Animation(100, (t) => t / 400),
        new Animation(100, (t) => t / 400),
    ]);
    leds.animate([
        new Animation(100, (t) => t / 400),
        new Animation(100, (t) => t / 500),
        new Animation(100, (t) => t / 400),
    ]);
    expect(() => {
        leds.animate([
            new Animation(100, (t) => t / 400),
            new Animation(100, (t) => t / 400),
            new Animation(100, (t) => t / 400),
            new Animation(100, (t) => t / 400),
        ]);
    }).toThrow(Error);
    expect(() => {
        leds.animate([
            new Animation(100, (t) => t / 400),
            new Animation(100, (t) => t / 400),
        ]);
    }).toThrow(Error);
    leds.stopAnimation();
});

it("Requires animation values array to be of the same length as there are LEDs", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate(new Animation(100, (t) => t / 750), [false, true, true]);
    leds.animate(new Animation(100, (t) => t / 750), [false, true, true]);
    leds.animate(new Animation(100, (t) => t / 750), [255, 255, 255]);
    leds.animate(new Animation(100, (t) => t / 750), [255, 35, 172]);
    expect(() => {
        leds.animate(new Animation(100, (t) => t / 750), [255, 35, 172, 212]);
    }).toThrow(Error);
    expect(() => {
        leds.animate(new Animation(100, (t) => t / 750), [255, 35]);
    }).toThrow(Error);
    expect(() => {
        leds.animate(new Animation(100, (t) => t / 750), [
            false,
            true,
            true,
            false,
        ]);
    }).toThrow(Error);
    expect(() => {
        leds.animate(new Animation(100, (t) => t / 750), [false, true]);
    }).toThrow(Error);
    leds.stopAnimation();
});

it("Requires all values within the animation value array to be of the same type", () => {
    const leds = new LEDArray([7, 10, 15]);
    expect(() => {
        leds.animate(
            new Animation(100, (t) => t / 750),
            // @ts-ignore Intentional test
            [255, false, 172]
        );
    }).toThrow(Error);
    expect(() => {
        leds.animate(
            new Animation(100, (t) => t / 750),
            // @ts-ignore Intentional test
            [true, 35, false]
        );
    }).toThrow(Error);
    expect(() => {
        leds.animate(
            new Animation(100, (t) => t / 750),
            // @ts-ignore Intentional test
            [false, true, 190]
        );
    }).toThrow(Error);
    expect(() => {
        leds.animate(
            new Animation(100, (t) => t / 750),
            // @ts-ignore Intentional test
            [83, true, false]
        );
    }).toThrow(Error);
    leds.stopAnimation();
});

it("Requires the values array if a single Animation is passed in the Animation options argument", () => {
    const leds = new LEDArray([7, 10, 15]);
    expect(() => {
        leds.animate({
            animation: new Animation(100, (t) => t / 38),
        });
    }).toThrow(Error);
    leds.animate({
        animation: new Animation(100, (t) => t / 38),
        values: [40, 55, 90],
    });
    leds.stopAnimation();
});

it("Does not require a values array if an Animation array is passed in the Animation options argument", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
        ],
    });
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
        ],
        values: [40, 55, 90],
    });
    leds.stopAnimation();
});

it("Starts animation automatically if autoStart is not set in the animation options", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
        ],
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
    }, 100);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(6);
        leds.stopAnimation();
    }, 200);
    jest.runAllTimers();
});

it("Starts animation automatically if autoStart is set to true in the animation options", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
        ],
        autoStart: true,
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
    }, 100);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(6);
        leds.stopAnimation();
    }, 200);
    jest.runAllTimers();
});

it("Does not start animation automatically if autoStart is set to false in the animation options", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
        ],
        autoStart: false,
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(0);
    }, 100);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        leds.stopAnimation();
    }, 200);
    jest.runAllTimers();
});

it("Throws an error if you attempt to start an animation before setting one", () => {
    const leds = new LEDArray([7, 10, 15]);
    expect(() => {
        leds.startAnimation();
    }).toThrow(Error);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
        ],
        autoStart: false,
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        leds.startAnimation();
        leds.stopAnimation();
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        leds.stopAnimation();
    }, 100);
    jest.runAllTimers();
});

it("Starts animation when startAnimation() is called", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 38),
        ],
        autoStart: false,
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        leds.startAnimation();
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        setTimeout(() => {
            expect(pwmSpy).toHaveBeenCalledTimes(6);
            leds.stopAnimation();
        }, 200);
    }, 100);
    jest.runAllTimers();
});

it("Stops animation when stopAnimation() is called", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 38),
            new Animation(100, (t) => t / 50),
            new Animation(100, (t) => t / 21),
        ],
        autoStart: false,
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    leds.stopAnimation();
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        leds.startAnimation();
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        setTimeout(() => {
            expect(pwmSpy).toHaveBeenCalledTimes(6);
            leds.stopAnimation();
            setTimeout(() => {
                leds.startAnimation();
                expect(pwmSpy).toHaveBeenCalledTimes(6);
                setTimeout(() => {
                    expect(pwmSpy).toHaveBeenCalledTimes(9);
                    leds.stopAnimation();
                    leds.stopAnimation();
                }, 100);
            }, 100);
        }, 200);
    }, 100);
    jest.runAllTimers();
});

it("Stops animation when off() is called", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: new Animation(100, (t) => t / 38),
        values: [40, 55, 90],
        autoStart: false,
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        leds.startAnimation();
        expect(pwmSpy).toHaveBeenCalledTimes(0);
        setTimeout(() => {
            expect(pwmSpy).toHaveBeenCalledTimes(6);
            expect(digitalSpy).toHaveBeenCalledTimes(0);
            leds.off();
            expect(digitalSpy).toHaveBeenCalledTimes(3);
            setTimeout(() => {
                leds.startAnimation();
                expect(pwmSpy).toHaveBeenCalledTimes(6);
                setTimeout(() => {
                    expect(pwmSpy).toHaveBeenCalledTimes(9);
                    expect(digitalSpy).toHaveBeenCalledTimes(3);
                    leds.off();
                    leds.off();
                    expect(digitalSpy).toHaveBeenCalledTimes(9);
                    leds.off();
                }, 100);
            }, 100);
        }, 200);
    }, 100);
    jest.runAllTimers();
});

it("Follows a provided singular animation curve for all values", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: new Animation(100, (t) => t / 1000),
        values: [40, 55, 255],
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        expect((pwmSpy.mock.calls[0] as any)[0]).toBeCloseTo(
            Math.round(0.1 * 40),
            5
        );
        expect((pwmSpy.mock.calls[1] as any)[0]).toBeCloseTo(
            Math.round(0.1 * 55),
            5
        );
        expect((pwmSpy.mock.calls[2] as any)[0]).toBeCloseTo(
            Math.round(0.1 * 255),
            5
        );
        leds.stopAnimation();
    }, 100);
    jest.runAllTimers();
});

it("Follows the animation curve for each individual LED when passed an animation array", () => {
    const leds = new LEDArray([7, 10, 15]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 1000),
            new Animation(100, (t) => t / 2000),
            new Animation(100, (t) => t / 2500),
        ],
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(3);
        expect((pwmSpy.mock.calls[0] as any)[0]).toBeCloseTo(
            Math.round(0.1 * 255),
            5
        );
        expect((pwmSpy.mock.calls[1] as any)[0]).toBeCloseTo(
            Math.round(0.05 * 255),
            5
        );
        expect((pwmSpy.mock.calls[2] as any)[0]).toBeCloseTo(
            Math.round(0.04 * 255),
            5
        );
        leds.stopAnimation();
    }, 100);
    jest.runAllTimers();
});

it("Restarts a singular animation where it left off when startAnimation() is called", () => {
    const leds = new LEDArray([7, 10]);
    leds.animate({
        animation: new Animation(100, (t) => t / 1000),
        values: [40, 194],
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(2);
        expect((pwmSpy.mock.calls[0] as any)[0]).toBeCloseTo(
            Math.round(0.1 * 40),
            5
        );
        expect((pwmSpy.mock.calls[1] as any)[0]).toBeCloseTo(
            Math.round(0.1 * 194),
            5
        );
        leds.stopAnimation();
        setTimeout(() => {
            expect(pwmSpy).toHaveBeenCalledTimes(2);
            leds.startAnimation();
            setTimeout(() => {
                expect(pwmSpy).toHaveBeenCalledTimes(4);
                expect((pwmSpy.mock.calls[2] as any)[0]).toBeCloseTo(
                    Math.round(0.2 * 40),
                    5
                );
                expect((pwmSpy.mock.calls[3] as any)[0]).toBeCloseTo(
                    Math.round(0.2 * 194),
                    5
                );
                leds.off();
                setTimeout(() => {
                    expect(pwmSpy).toHaveBeenCalledTimes(4);
                    leds.startAnimation();
                    setTimeout(() => {
                        expect(pwmSpy).toHaveBeenCalledTimes(6);
                        expect((pwmSpy.mock.calls[4] as any)[0]).toBeCloseTo(
                            Math.round(0.3 * 40),
                            5
                        );
                        expect((pwmSpy.mock.calls[5] as any)[0]).toBeCloseTo(
                            Math.round(0.3 * 194),
                            5
                        );
                        leds.stopAnimation();
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
    jest.runAllTimers();
});

it("Restarts an animation array where they all left off when startAnimation() is called", () => {
    const leds = new LEDArray([7, 10]);
    leds.animate({
        animation: [
            new Animation(100, (t) => t / 1000),
            new Animation(100, (t) => t / 2500),
        ],
    });
    expect(pwmSpy).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(pwmSpy).toHaveBeenCalledTimes(2);
        expect((pwmSpy.mock.calls[0] as any)[0]).toBeCloseTo(
            Math.round(0.1 * 255),
            5
        );
        expect((pwmSpy.mock.calls[1] as any)[0]).toBeCloseTo(
            Math.round(0.04 * 255),
            5
        );
        leds.stopAnimation();
        setTimeout(() => {
            expect(pwmSpy).toHaveBeenCalledTimes(2);
            leds.startAnimation();
            setTimeout(() => {
                expect(pwmSpy).toHaveBeenCalledTimes(4);
                expect((pwmSpy.mock.calls[2] as any)[0]).toBeCloseTo(
                    Math.round(0.2 * 255),
                    5
                );
                expect((pwmSpy.mock.calls[3] as any)[0]).toBeCloseTo(
                    Math.round(0.08 * 255),
                    5
                );
                leds.off();
                setTimeout(() => {
                    expect(pwmSpy).toHaveBeenCalledTimes(4);
                    leds.startAnimation();
                    setTimeout(() => {
                        expect(pwmSpy).toHaveBeenCalledTimes(6);
                        expect((pwmSpy.mock.calls[4] as any)[0]).toBeCloseTo(
                            Math.round(0.3 * 255),
                            5
                        );
                        expect((pwmSpy.mock.calls[5] as any)[0]).toBeCloseTo(
                            Math.round(0.12 * 255),
                            5
                        );
                        leds.stopAnimation();
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
    jest.runAllTimers();
});
