class Animation {
    /**
     * Timestamp in milliseconds since 01-01-1970 at which this Animation's
     *  {@link #start()} function was called. If the Animation has not yet been
     *  started, this is equal to null. If the Animation was started and then
     *  subsequently stopped, this will still be the accurate start time until
     *  it is started again. However, since this value is used when calculating
     *  the next animation's frame, we must update this value whenever the
     *  animation is paused and then resumed.
     * @private
     */
    private startTime: number | null = null;
    /**
     * Time at which the Animation was last stopped. If this Animation has not
     *  yet been stopped, then this is null. Otherwise, it is used if the
     *  Animation is resumed again in order to resume the Animation at the same
     *  spot.
     * @private
     */
    private stopTime: number | null = null;
    /**
     * Frequency at which this Animation should call all of its subscribers.
     *  This does not alter the frequency of the Curve.
     * @private
     */
    private readonly frameRate: number;
    /**
     * Curve function passed in the constructor. This is used to calculate
     *  how the Animation should appear at any given point in time.
     * @private
     */
    private readonly curve: (time: number) => number;
    /**
     * NodeJS Interval which is responsible for calling all the subscribers
     *  at each frame update. If the Animation is not running, then this is
     *  null.
     * @private
     */
    private timer: NodeJS.Timer | null = null;
    /**
     * Array of subscriber functions which should be called every time the
     *  Animation updates.
     * @private
     */
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
        this.frameRate = Math.floor(refreshRate);
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
            }, this.frameRate);
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

    /**
     * Whether this Animation is currently running or not.
     */
    public isRunning(): boolean {
        return this.timer !== null;
    }

    /**
     * Subscribe a function to be called whenever this Animation updates. If the
     *  Animation is running, the function you pass in will be called at the
     *  frequency of whatever framerate you passed into the constructor.
     * @param listener Listener function which is called to notify you whenever
     *  this Animation updates frames. It is passed a number which is the
     *  output value of the Animation, which you can use to display in whatever
     *  way your application is designed to use it. The value passed is the
     *  number of milliseconds since this Animation was started. If you pause
     *  the animation using {@link #stopAnimation()} and then later resume it,
     *  the animation resumes where it left off. Passing the same instance of
     *  a function twice will not let you subscribe multiple times.
     */
    public subscribe(listener: (newValue: number) => void): Animation {
        if (!this.subscribers.includes(listener)) {
            this.subscribers.push(listener);
        }
        return this;
    }

    /**
     * Stop a function from listening to this Animation. The function must be
     *  the exact same instance as the function you passed into
     *  {@link #subscribe()}, not just a functionally identical one. If you pass
     *  a function which is already not subscribed, nothing will happen.
     * @param listener Function to unsubscribe from listening to this Animation.
     *  If this function is not currently listening, nothing happens.
     */
    public unsubscribe(listener: (newValue: number) => void): Animation {
        const index = this.subscribers.indexOf(listener);
        if (index >= 0) {
            this.subscribers.splice(index, 1);
        }
        return this;
    }

    /**
     * Create a copy of this Animation, copying the curve function and the frame
     *  rate. A new instance of the curve function isn't created.
     */
    public copy(): Animation {
        return new Animation(this.curve, this.frameRate);
    }

    /**
     * Call all the subscriber functions with the current progress.
     * @private
     */
    private callSubscribers(): void {
        const now = Date.now();
        for (const sub of this.subscribers) {
            sub(this.calculate(now - (this.startTime ?? 0)));
        }
    }
}

export default Animation;
