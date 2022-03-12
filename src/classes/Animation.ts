class Animation {
    private startTime: number | null = null;
    private stopTime: number | null = null;
    private readonly frequency: number;
    private readonly curve: (time: number) => number;
    private timer: NodeJS.Timer | null = null;
    private readonly subscribers: ((newValue: number) => void)[] = [];

    /**
     * Creates an Animation which refreshes at a rate of 60 times per second.
     * @param curve Function defining the curve of the animation, where time is
     *  the input and the output is a value between 0 and 1 inclusive. If a value
     *  outside that range is returned, it will be clamped within the range. The
     *  function is called every refreshRate ms, or whenever {@link #calculate()}
     *  is called. Its argument is the current time minus the time the animation
     *  was started. If the animation hasn't been started yet, it's passed 0.
     *  It is possible for users to pass a custom time to {@link #calculate()},
     *  which will be passed to your curve function instead of the calculated
     *  time.
     */
    public constructor(curve: (time: number) => number);
    /**
     * Creates an Animation.
     * @param curve Function defining the curve of the animation, where time is
     *  the input and the output is a value between 0 and 1 inclusive. If a value
     *  outside that range is returned, it will be clamped within the range. The
     *  function is called every refreshRate ms, or whenever {@link #calculate()}
     *  is called. Its argument is the current time minus the time the animation
     *  was started. If the animation hasn't been started yet, it's passed 0.
     *  It is possible for users to pass a custom time to {@link #calculate()},
     *  which will be passed to your curve function instead of the calculated
     *  time.
     * @param refreshRate How often in ms this animation should be refreshed, i.e.
     *  how often should the subscribers be called with an update. Must be
     *  greater than or equal to 1. Anything less than 15 is likely unnecessary,
     *  and may not even be processed in a timely manner. If the passed value is
     *  not an integer, it is rounded to the closest integer.
     */
    public constructor(curve: (time: number) => number, refreshRate: number);
    public constructor(curve: (time: number) => number, refreshRate?: number) {
        if (refreshRate === undefined) {
            refreshRate = 60;
        } else if (refreshRate < 1) {
            throw new Error(
                "Cannot create an animation with a refresh rate less than 1!"
            );
        }
        this.frequency = Math.floor(refreshRate);
        this.curve = curve;
    }

    /**
     * Start the Animation. Will call all subscribers at an interval set by the
     *  frequency passed to the constructor. The Animation will continue to run
     *  even if it has no subscribers. Nothing happens if you start an animation
     *  which is already running. If you start an Animation which was previously
     *  running and then stopped, it will resume progress from where it stopped.
     * @returns this
     */
    public start(): Animation {
        if (!this.isRunning()) {
            if (this.startTime === null) {
                this.startTime = Date.now();
            }
            // In order to resume where we left off we have to adjust start time
            if (this.stopTime !== null) {
                this.startTime += Date.now() - this.stopTime;
                this.stopTime = null;
            }
            this.timer = setInterval(() => {
                this.callSubscribers();
            }, this.frequency);
        }
        return this;
    }

    /**
     * Stop the Animation. Any subscribers to this Animation will not be called
     *  again until the Animation is started again. Nothing happens if you stop
     *  an animation which is already stopped. If you start an animation which
     *  was previously running and then stopped, it will resume progress from
     *  where it stopped.
     * @returns this
     */
    public stop(): Animation {
        if (this.isRunning()) {
            this.stopTime = Date.now();
            clearInterval(this.timer as NodeJS.Timer);
            this.timer = null;
        }
        return this;
    }

    /**
     * Reset the timer on this animation. If the timer is running, it does not
     *  stop. Instead, the animation gets moved back to its starting position,
     *  as if it has just started. If it is stopped, then the start time is
     *  reset to zero and when the animation is started again, it will start
     *  from the beginning.
     *  @returns this
     */
    public reset(): Animation {
        if (this.isRunning()) {
            this.startTime = Date.now();
        } else {
            this.startTime = null;
            this.stopTime = null;
        }
        return this;
    }

    /**
     * Calculate the animation's value at the current time, compared to when the
     *  animation was started. For example, if 500 milliseconds has passed since
     *  the animation was started, then 500 will be passed to the curve function
     *  and its result will be returned. If the animation has not yet started,
     *  it will pass 0 to the curve function.
     */
    public calculate(): number;
    /**
     * Calculate the animation's value at a custom time. Time is measured in
     *  milliseconds. So, if you want to retrieve what the animation will be
     *  at after 500 milliseconds of running, you may pass 500 to this function.
     * @param time The time to calculate this animation at. This number may
     *  be negative, as long as that does not break the curve function passed
     *  to the constructor.
     */
    public calculate(time: number): number;
    public calculate(time?: number): number {
        if (time === undefined) {
            if (this.startTime === null) {
                time = 0;
            } else {
                time = Date.now() - this.startTime;
            }
        }
        return Math.max(0, Math.min(1, this.curve(time)));
    }

    public isRunning(): boolean {
        return this.timer !== null;
    }

    public subscribe(listener: (newValue: number) => void): Animation {
        if (!this.subscribers.includes(listener)) {
            this.subscribers.push(listener);
        }
        return this;
    }

    public unsubscribe(listener: (newValue: number) => void): Animation {
        const index = this.subscribers.indexOf(listener);
        if (index >= 0) {
            this.subscribers.splice(index, 1);
        }
        return this;
    }

    public copy(): Animation {
        return new Animation(this.curve, this.frequency);
    }

    private callSubscribers(): void {
        const now = Date.now();
        for (const sub of this.subscribers) {
            sub(this.calculate(now - (this.startTime ?? 0)));
        }
    }
}

export default Animation;
