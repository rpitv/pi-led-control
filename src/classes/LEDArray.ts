import LED from "./LED";
import Animation from "./Animation";

type AnimationOptions = {
    animation: (Animation | null)[] | Animation;
    values?: number[];
    autoStart?: boolean;
};

/**
 * An LED array is a set of multiple LED objects which are controlled in bulk.
 *  Typical use cases for this would probably be:
 *  - An RGB LED with 3 individual LED components for each color.
 *  - A set of LEDs which collectively make up a display or shape.
 */
class LEDArray {
    /**
     * Array of individual LEDs contained within this LED.
     * @private
     */
    private readonly leds: LED[] = [];
    /**
     * Array of false values equal to the size of {@link #leds}. Creating this
     *  array beforehand saves resources later when the user calls
     *  {@link #off()}. This is the only purpose of this array. It should not be
     *  modified.
     * @private
     */
    private readonly falseArray: boolean[] = [];
    /**
     * The animation that was last running. It's unknown if it's still running
     *  or not. To determine that, check {@link Animation#isRunning()}. If this
     *  is set to null, then this LED array has not had an animation run on it
     *  since instantiation. There are two ways to run an animation on an LED
     *  array, which changes how the options object is structured. For more
     *  info, look at the {@link #animate()} method.
     * @private
     */
    private animation: AnimationOptions | null = null;

    /**
     * Constructor
     * @param pins Pin numbers for each of the different LEDs connected to
     *  this LED array. Expected to all be greater than or equal to 0.
     * @param invert Optional array of booleans for each of the different LEDs
     *  signifying whether the corresponding LED index should be inverted.
     *  Alternatively, a single boolean value for all the LEDs. Expected size to
     *  be equal to the length of the passed pins array. If not passed, then
     *  a value of "false" is assumed.
     * @throws Error if the length of pins array is not equal to length of
     *  invert array.
     * @throws Error if any pin is less than 0.
     */
    constructor(pins: number[], invert?: boolean[] | boolean) {
        if (Array.isArray(invert) && pins.length !== invert.length) {
            throw new Error(
                "Length of pins array is not equal to length of invert array."
            );
        }
        if (invert === undefined) {
            invert = false;
        }

        for (let i = 0; i < pins.length; i++) {
            const pin = pins[i];
            if (pin < 0) {
                throw new Error(
                    "Pin index " + i + " (" + pin + ") is less than 0."
                );
            }
            const pinInvert = typeof invert === "boolean" ? invert : invert[i];
            this.leds.push(new LED(pin, pinInvert));
            this.falseArray.push(false);
        }
    }

    /**
     * Start an animation across this LED array's LEDs.
     * @param animation Array of animations, which each animation corresponding
     *  to the LED at the same index, passed in the constructor. Expected to be
     *  the same length as the number of LEDs in this LEDArray. You may pass
     *  null in place of a function for indices which you don't want to be
     *  animated. These indices will respond to normal write() calls and won't
     *  be overwritten by the animation.The animation will immediately start.
     *  If you do not want the animation to automatically start, pass false to
     *  the autoStart parameter.
     * @throws Error if the length of the animation array is not equal to the
     *  number of LEDs.
     */
    animate(animation: (Animation | null)[]): void;
    /**
     * Start an animation across this LED array's LEDs.
     * @param animation Animation to be used for all the LEDs in this LED
     *  array, scaled to the appropriate value based on what is passed in
     *  the values argument of this function.
     * @param values Array of values to cap the animation at, with each value
     *  corresponding to a LED at the same index. For example, in an LED array
     *  with 3 LEDs, passing in the array [200, 100, 50] means that when the
     *  animation reaches a point of half brightness, the three LEDs would be at
     *  a brightness of 100, 50, and 25 respectively. It is expected that the
     *  array's length is equal to the number of LEDs in this LEDArray. If you
     *  wish to have more control over the animation by having different
     *  proportions at different points throughout the Animation, take a look at
     *  the different parameters to this method.
     * @throws Error if the length of the values array isn't equal to the total
     *  number of LEDs in this LEDArray.
     */
    animate(animation: Animation, values: number[]): void;
    /**
     * Start an animation across this LED array's LEDs.
     * @param options Options argument which allows more verbose control over
     *  how the animation will operate. Properties:
     *  - animation: Animation or (Animation|null)[]. If you pass a single
     *      Animation, then you must also pass the values of the animation via
     *      the values property. Otherwise, the animation array must have equal
     *      length to the number of LEDs. You may pass null in place of a
     *      function for indices which you don't want to be animated. These
     *      indices will respond to normal write() calls and won't be
     *      overwritten by the animation.
     *  - autoStart?: boolean. If true or undefined, the animation immediately
     *      starts within this function call. Otherwise, you must call
     *      {@link #startAnimation()} to start the animation.
     *  - values: boolean[]|number[]. The values corresponding to the animation.
     *      This is not necessary if you are passing multiple animation
     *      functions. This is because, in that case, the value of each LED in
     *      the animation is controlled by its corresponding animation. This
     *      allows complex animations for each individual LED. On the other
     *      hand, if animation is a single Animation, the value of each LED is
     *      not controlled by its own animation. You must include this value
     *      in order to specify the proportions of the brightness of each LED,
     *      which will be maintained throughout the animation. Expected to be
     *      defined and non-null if animation is a single Animation and not an
     *      array. Also expected to be the same length as the number of LEDs.
     * @throws Error if the length of the animation array is not equal to the
     *  number of LEDs in this LEDArray.
     * @throws Error if the length of the values array is not equal to the
     *  number of LEDs in this LEDArray.
     * @throws Error if the values array is not of all the same type.
     * @throws Error if a single Animation is provided, but no values array is
     *  provided.
     */
    animate(options: AnimationOptions): void;
    animate(
        arg1: (Animation | null)[] | AnimationOptions | Animation,
        arg2?: number[]
    ): void {
        this.stopAnimation();
        let options: AnimationOptions;
        if (Array.isArray(arg1) || arg1 instanceof Animation) {
            options = {
                animation: arg1,
                values: arg2,
            };
        } else {
            options = arg1;
        }
        if (options.autoStart === undefined) {
            options.autoStart = true;
        }

        if (options.animation instanceof Animation) {
            if (options.values === undefined) {
                throw new Error(
                    "Singular animation provided but proportions values provided."
                );
            }
            if (options.values.length !== this.leds.length) {
                throw new Error(
                    "Length of values array is not equal to the number of LEDs."
                );
            }
            for (let i = 0; i < options.values.length; i++) {
                if (typeof options.values[i] !== typeof options.values[0]) {
                    throw new Error(
                        "Animation values are not all of the same type."
                    );
                }
            }
            // In the absence of an animation array, we could create our own,
            //  but it's more efficient to just have a single Animation and
            //  write to the LEDs directly at this level.
            this.animation = {
                animation: options.animation.copy(),
                autoStart: options.autoStart,
                values: options.values,
            };
            (this.animation.animation as Animation).subscribe((newValue) => {
                if (
                    this.animation === null ||
                    this.animation.values === undefined
                ) {
                    return;
                }
                for (let i = 0; i < this.leds.length; i++) {
                    const led = this.leds[i];
                    const ratio = this.animation.values[i] / 255;
                    led.write(Math.round(newValue * ratio * 255));
                }
            });

            if (options.autoStart) {
                this.startAnimation();
            }
        } else {
            if (options.animation.length !== this.leds.length) {
                throw new Error(
                    "Length of animations array is not equal to the number of LEDs."
                );
            }
            // An animation array can just have the individual animations
            //  passed onto the individual LEDs.
            for (let i = 0; i < options.animation.length; i++) {
                if (options.animation[i] !== null) {
                    this.leds[i].animate(
                        options.animation[i] as Animation,
                        options.autoStart
                    );
                }
            }
            this.animation = {
                animation: options.animation,
                autoStart: options.autoStart,
                values: options.values,
            };
        }
    }

    /**
     * Start the Animation which was set by {@link #animate()}. If the
     *  Animation is already running, does nothing.
     * @throws If no Animation has been set yet via {@link #animate()}.
     * @see #animate()
     */
    startAnimation(): void {
        if (this.animation === null) {
            throw new Error("Animation has not yet been set by animate()");
        }
        if (this.animation.animation instanceof Animation) {
            // Master Animation for all LEDs at a specified proportion.
            this.animation.animation.start();
        } else {
            // Animation[] -- Each animation is passed directly to LEDs
            for (let i = 0; i < this.leds.length; i++) {
                if (this.animation.animation[i] !== null) {
                    this.leds[i].startAnimation();
                }
            }
        }
    }

    /**
     * Stop any Animation which is currently happening. If the LED is not
     *  currently animating, nothing happens. Animation is still stored, and
     *  can be resumed by calling {@link #startAnimation()}. The Animation
     *  will resume from the same location at which it stopped. This method does
     *  NOT overwrite the last frame of the Animation. If you'd like to also
     *  turn off the LED when the Animation is stopped, look at {@link #off()}.
     */
    stopAnimation(): void {
        if (this.animation !== null) {
            if (this.animation.animation instanceof Animation) {
                // Master Animation for all LEDs at a specified proportion.
                this.animation.animation.stop();
            } else {
                // Animation[] -- Each animation is passed directly to LEDs
                for (let i = 0; i < this.leds.length; i++) {
                    if (this.animation.animation[i] !== null) {
                        this.leds[i].stopAnimation();
                    }
                }
            }
        }
    }

    /**
     * Turn off the LED. Also disables any Animation.
     *  Accomplishes this by writing a digital off signal to each of the LEDs.
     */
    off(): void {
        this.stopAnimation();
        this.write(...this.falseArray);
    }

    /**
     * Write a set of PWM values to each of the corresponding LEDs. This method
     *  does not stop the currently-running Animation, and whatever you write
     *  will get overwritten on the next Animation frame, if one exists. Writes
     *  should be sent in order of the LED pins which were passed in the
     *  constructor. For example, if an array of [4, 5, 8] was passed as the
     *  pins, a call of write(255, 128, 42) should result in pin 4 receiving
     *  255, 5 receiving 128, and 8 receiving 42 in chronological order.
     * @param values Array of numbers, where each number in the array
     *  corresponds to one of the LEDs. Therefore, array is expected to be the
     *  same length as the number of LEDs in this LEDArray. All numbers are also
     *  expected to be between 0 and 255 inclusively. For each LED, if it has
     *  invert enabled, the value sent to the GPIO pin will be 255 - values[i].
     *  All the values in the array are expected to be of the same type (i.e.,
     *  either all numbers or all booleans).
     * @throws Error if values array is not the same size as the total number of
     *  LEDs.
     * @throws Error if any number is outside the range 0-255. All the LEDs
     *  before the first one outside of range will still be written.
     * @throws Error if any of the values in the array are not numbers.
     */
    write(...values: number[]): void;
    /**
     * Write a set of digital values to each of the corresponding LEDs. This
     *  method does not stop the currently-running Animation, and whatever you
     *  write will get overwritten on the next Animation frame, if one exists.
     *  Writes should be sent in order of the LED pins which were passed in the
     *  constructor. For example, if an array of [4, 5, 8] was passed as the
     *  pins, a call of write(false, true, false) should result in pin 4
     *  receiving false, 5 receiving true, and 8 receiving false in
     *  chronological order.
     * @param values Array of booleans, where each boolean in the array
     *  corresponds to one of the LEDs. Therefore, array is expected to be the
     *  same length as the number of LEDs in this LEDArray. For each LED, if it
     *  has invert enabled, the value sent to the GPIO pin will be !values[i].
     *  All the values in the array are expected to be of the same type (i.e.,
     *  either all numbers or all booleans).
     * @throws Error if values array is not the same size as the total number of
     *  LEDs.
     * @throws Error if any of the values in the array are not booleans.
     */
    write(...values: boolean[]): void;
    write(...values: number[] | boolean[]): void {
        if (values.length !== this.leds.length) {
            throw new Error(
                "Number of values and number of LEDs do not match."
            );
        }
        if (typeof values[0] === "number") {
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                if (typeof value !== "number") {
                    throw new Error(
                        "LED value at index " + i + "is not a number."
                    );
                }
                if (value < 0 || value > 255) {
                    throw new Error(
                        "LED with index " +
                            i +
                            " has a value outside of the range 0-255 (" +
                            value +
                            ")"
                    );
                }

                this.leds[i].write(value);
            }
        } else {
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                if (typeof value !== "boolean") {
                    throw new Error(
                        "LED value at index " + i + "is not a boolean."
                    );
                }

                this.leds[i].write(value);
            }
        }
    }
}

export default LEDArray;
