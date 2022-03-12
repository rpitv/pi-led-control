import Animation from "./Animation";

jest.useFakeTimers();

it("Does not allow animations with refresh rates lower than 1.", () => {
    new Animation(() => 1, 1);
    expect(() => {
        new Animation(() => 1, 0.99);
    }).toThrow(Error);
    expect(() => {
        new Animation(() => 1, 0);
    }).toThrow(Error);
    expect(() => {
        new Animation(() => 1, -1);
    }).toThrow(Error);
    expect(() => {
        new Animation(() => 1, -10000);
    }).toThrow(Error);
});

it("Calculates the correct value when passed a time.", () => {
    const anim = new Animation((t) => t / 500, 1);

    expect(anim.calculate(0)).toBeCloseTo(0, 5);
    expect(anim.calculate(1)).toBeCloseTo(1 / 500, 5);
    expect(anim.calculate(50)).toBeCloseTo(50 / 500, 5);
    expect(anim.calculate(499)).toBeCloseTo(499 / 500, 5);
    expect(anim.calculate(500)).toBeCloseTo(1, 5);
});

it("Calculates the correct value when not passed a time.", () => {
    const start = Date.now();
    const anim = new Animation((t) => t / 500, 1);
    expect(anim.calculate()).toBeCloseTo(0, 5);
    anim.start();
    expect(anim.calculate()).toBeCloseTo(0, 5);

    setTimeout(() => {
        const now = Date.now();
        expect(anim.calculate()).toBeCloseTo((now - start) / 500, 5);
    }, 15);
    setTimeout(() => {
        const now = Date.now();
        expect(anim.calculate()).toBeCloseTo((now - start) / 500, 5);
    }, 370);
    setTimeout(() => {
        expect(anim.calculate()).toBeCloseTo(1, 5);
    }, 500);
    setTimeout(() => {
        expect(anim.calculate()).toBeCloseTo(1, 5);
        anim.stop();
    }, 758);

    jest.runAllTimers();
});

it("Clamps output within the range of 0-1 when the curve function returns something outside that range.", () => {
    const anim = new Animation((t) => t / 500, 1);

    expect(anim.calculate(-1)).toBeCloseTo(0, 5);
    expect(anim.calculate(-50)).toBeCloseTo(0, 5);
    expect(anim.calculate(501)).toBeCloseTo(1, 5);
    expect(anim.calculate(563)).toBeCloseTo(1, 5);
});

it("Does not call subscribers until the animation is started.", () => {
    const mock = jest.fn();
    new Animation(() => 1, 100).subscribe(mock);
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(0);
    }, 2000);
    jest.runAllTimers();
});

it("Calls the subscribers the appropriate number of times.", () => {
    const mock = jest.fn();
    const anim = new Animation(() => 1, 100).subscribe(mock);
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(20);
        anim.stop();
    }, 2000);
    jest.runAllTimers();
});

it("Stops calling subscribers after having been stopped.", () => {
    const mock = jest.fn();
    const anim = new Animation(() => 1, 100).subscribe(mock);
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(5);
        anim.stop();
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(5);
        }, 500);
    }, 500);
    jest.runAllTimers();
});

it("Does nothing when start() and stop() are called when they don't need to be.", () => {
    const mock = jest.fn();
    const anim = new Animation(() => 1, 100)
        .start()
        .subscribe(mock)
        .stop()
        .start();
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(5);
        anim.stop();
        anim.stop();
        anim.start();
        setTimeout(() => {
            anim.start();
        }, 250);
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(10);
            anim.stop().start().stop();
        }, 500);
    }, 500);
    jest.runAllTimers();
});

it("Does not call subscribers which have unsubscribed.", () => {
    const mock = jest.fn();
    const anim = new Animation(() => 1, 100).subscribe(mock);
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(20);
        anim.unsubscribe(mock);
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(20);
            anim.stop();
        }, 2000);
    }, 2000);
    jest.runAllTimers();
});

it("Does not allow the same function to subscribe multiple times.", () => {
    const mock = jest.fn();
    const anim = new Animation(() => 1, 100).subscribe(mock).subscribe(mock);
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(20);
        anim.subscribe(mock);
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(40);
            anim.stop();
        }, 2000);
    }, 2000);
    jest.runAllTimers();
});

it("Does nothing when a function which isn't subscribed unsubscribes.", () => {
    const mock = jest.fn();
    const anim = new Animation(() => 1, 100);
    anim.unsubscribe(mock);
    anim.subscribe(mock);
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(20);
        anim.unsubscribe(mock);
        anim.unsubscribe(mock);
        anim.unsubscribe(mock);
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(20);
            anim.unsubscribe(mock);
            anim.stop();
            anim.unsubscribe(mock);
        }, 2000);
    }, 2000);
    jest.runAllTimers();
});

it("Calls subscribers with the correct value.", () => {
    let mock = jest.fn();
    let anim = new Animation(() => 0.5, 100).subscribe(mock);
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(3);
        expect((mock.mock.calls[0] as any)[0]).toEqual(0.5);
        expect((mock.mock.calls[1] as any)[0]).toEqual(0.5);
        expect((mock.mock.calls[2] as any)[0]).toEqual(0.5);
        anim.stop();

        mock = jest.fn();
        anim = new Animation((time: number) => time / 400, 100).subscribe(mock);
        anim.start();
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(3);
            expect((mock.mock.calls[0] as any)[0]).toBeCloseTo(0.25, 5);
            expect((mock.mock.calls[1] as any)[0]).toBeCloseTo(0.5, 5);
            expect((mock.mock.calls[2] as any)[0]).toBeCloseTo(0.75, 5);
            anim.stop();
        }, 300);
    }, 300);
    jest.runAllTimers();
});

it("Clamps overflow values outside of the range of 0-1.", () => {
    let mock = jest.fn();
    let anim = new Animation(() => 1.5, 100).subscribe(mock);
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(1);
        expect((mock.mock.calls[0] as any)[0]).toEqual(1);
        anim.stop();

        mock = jest.fn();
        anim = new Animation(() => -1.5, 100).subscribe(mock);
        anim.start();
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(1);
            expect((mock.mock.calls[0] as any)[0]).toBeCloseTo(0, 5);
            anim.stop();
        }, 100);
    }, 100);
    jest.runAllTimers();
});

it("Correctly reports whether an animation is running.", () => {
    const mock = jest.fn();
    const anim = new Animation(() => 1.5, 100);
    expect(anim.isRunning()).toEqual(false);
    anim.subscribe(mock);
    expect(anim.isRunning()).toEqual(false);
    anim.start();
    expect(anim.isRunning()).toEqual(true);
    anim.stop();
    expect(anim.isRunning()).toEqual(false);
    anim.start();
    expect(anim.isRunning()).toEqual(true);
    setTimeout(() => {
        expect(anim.isRunning()).toEqual(true);
        anim.stop();
        expect(anim.isRunning()).toEqual(false);
        anim.start();
        expect(anim.isRunning()).toEqual(true);
        anim.stop();
    }, 100);
    jest.runAllTimers();
});

it("Restores progress of animation after being previously stopped.", () => {
    const mock = jest.fn();
    const anim = new Animation((time: number) => time / 800, 100).subscribe(
        mock
    );
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(3);
        expect((mock.mock.calls[0] as any)[0]).toBeCloseTo(1 / 8, 5);
        expect((mock.mock.calls[1] as any)[0]).toBeCloseTo(1 / 4, 5);
        expect((mock.mock.calls[2] as any)[0]).toBeCloseTo(3 / 8, 5);
        anim.stop();
        setTimeout(() => {
            anim.start();
            setTimeout(() => {
                expect(mock).toHaveBeenCalledTimes(5);
                expect((mock.mock.calls[3] as any)[0]).toBeCloseTo(1 / 2, 5);
                expect((mock.mock.calls[4] as any)[0]).toBeCloseTo(5 / 8, 5);
                anim.stop();
            }, 200);
        }, 600);
    }, 300);
    jest.runAllTimers();
});

it("Does not restore progress of animation after being reset.", () => {
    const mock = jest.fn();
    const anim = new Animation((time: number) => time / 800, 100).subscribe(
        mock
    );
    anim.start();
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(3);
        expect((mock.mock.calls[0] as any)[0]).toBeCloseTo(1 / 8, 5);
        expect((mock.mock.calls[1] as any)[0]).toBeCloseTo(1 / 4, 5);
        expect((mock.mock.calls[2] as any)[0]).toBeCloseTo(3 / 8, 5);
        anim.reset();
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(5);
            expect((mock.mock.calls[3] as any)[0]).toBeCloseTo(1 / 8, 5);
            expect((mock.mock.calls[4] as any)[0]).toBeCloseTo(1 / 4, 5);
            anim.stop();
            anim.reset();
            setTimeout(() => {
                anim.start();
                setTimeout(() => {
                    expect(mock).toHaveBeenCalledTimes(10);
                    expect((mock.mock.calls[5] as any)[0]).toBeCloseTo(
                        1 / 8,
                        5
                    );
                    expect((mock.mock.calls[6] as any)[0]).toBeCloseTo(
                        1 / 4,
                        5
                    );
                    expect((mock.mock.calls[7] as any)[0]).toBeCloseTo(
                        3 / 8,
                        5
                    );
                    expect((mock.mock.calls[8] as any)[0]).toBeCloseTo(
                        1 / 2,
                        5
                    );
                    expect((mock.mock.calls[9] as any)[0]).toBeCloseTo(
                        5 / 8,
                        5
                    );
                    anim.stop();
                }, 500);
            }, 400);
        }, 200);
    }, 300);
    jest.runAllTimers();
});

it("Defaults to refresh rate of 60fps when one isn't explicitly set", () => {
    const mock = jest.fn();
    const anim = new Animation((time: number) => time / 800)
        .subscribe(mock)
        .start();
    expect(mock).toHaveBeenCalledTimes(0);
    setTimeout(() => {
        expect(mock).toHaveBeenCalledTimes(3);
        setTimeout(() => {
            expect(mock).toHaveBeenCalledTimes(6);
            anim.stop();
        }, Math.floor(1 / 60) * 1000);
    }, Math.floor(1 / 60) * 1000);
    jest.runAllTimers();
});
