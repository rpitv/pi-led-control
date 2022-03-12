import { Gpio } from "pigpio";
import Animation from "./Animation";

/**
 * An LED is a type of connection on a Raspberry Pi GPIO board which has two
 *  wires: a cathode and an anode. This class does not care about the cathode,
 *  and only cares which GPIO pin the anode is connected to. Using an LED, you
 *  can send digital or a pulse modulated signal to the LED (or, whatever you
 *  have decided to plug in). You may also create Animations which are able to
 *  dynamically modulate the pulse modulation, allowing you to create things
 *  like blinking, fading, and custom complex animations.
 */
class LED {
    /**
     * GPIO pin on the Raspberry Pi that this LED is connected to.
     * @private
     * @readonly
     */
    private readonly pin: Gpio;
    /**
     * The animation that was last running. It's unknown if it's still running
     *  or not. To determine that, check {@link Animation#isRunning()}. If this
     *  is set to null, then this LED has not had an animation run on it since
     *  instantiation.
     * @private
     */
    private animation: Animation | null;
    /**
     * Whether it's necessary to invert the signal strength before it is
     *  displayed in writes. For example, when set to true, 255 is interpreted
     *  as off while 0 is interpreted as on. Similarly, true is off while false
     *  is on.
     * @private
     * @readonly
     */
    private readonly invert: boolean;

    /**
     * Constructor
     * @param pin {number} GPIO pin corresponding to the LED
     * @param invert {boolean} Whether the signals to these lights should be
     *  inverted before writing. E.g., true = off and false = on.
     */
    constructor(pin: number, invert: boolean) {
        if (pin < 0) {
            throw new Error("GPIO pins must be greater than or equal to 0.");
        }
        this.pin = new Gpio(pin, { mode: Gpio.OUTPUT });
        this.invert = invert;
        this.animation = null;
    }

    /**
     * Animate this LED following the provided Animation curve.
     * @param animation The animation to animate this LED with.
     */
    public animate(animation: Animation): void;
    /**
     * Animate this LED following the provided Animation curve.
     * @param animation The Animation to animate this LED with.
     * @param autoStart Whether this Animation should automatically start
     *  as soon as it is set. If not, then you must call
     *  {@link #startAnimation()} to start the Animation.
     */
    public animate(animation: Animation, autoStart: boolean): void;
    public animate(animation: Animation, autoStart?: boolean): void {
        this.stopAnimation();
        this.animation = animation.copy();
        this.animation.subscribe((val) => {
            this.pin.pwmWrite(Math.round(val * 255));
        });
        if (autoStart || autoStart === undefined) {
            this.animation.start();
        }
    }

    /**
     * Start the Animation which was set by {@link #animate()}. If the
     *  Animation is already running, does nothing.
     * @throws If no Animation has been set yet via {@link #animate()}.
     * @see #animate()
     */
    public startAnimation(): void {
        if (this.animation == null) {
            throw new Error("No animation is set on this LED.");
        }
        this.animation.start();
    }

    /**
     * Stop any Animation which is currently happening. If the LED is not
     *  currently animating, nothing happens. Animation is still stored, and
     *  can be resumed by calling {@link #startAnimation()}. The Animation
     *  will resume from the same location at which it stopped. This method does
     *  NOT overwrite the last frame of the Animation. If you'd like to also
     *  turn off the LED when the Animation is stopped, look at {@link #off()}.
     */
    public stopAnimation(): void {
        this.animation?.stop();
    }

    /**
     * Turn off the LED. Also disables any Animation.
     *  Accomplishes this by writing a digital off signal to the LED.
     */
    public off(): void {
        this.stopAnimation();
        this.write(false);
    }

    /**
     * Write an on/off state to the LED.
     * @param value Whether the LED should be turned on.
     */
    public write(value: boolean): void;
    /**
     * Write a PWM state to all three LEDs.
     * @param value LED value. Expected to be between 0 and 255, inclusive.
     * @throws Error if provided a color value outside the range 0-255.
     */
    public write(value: number): void;
    public write(value: number | boolean): void {
        if (typeof value === "number") {
            if (value < 0 || value > 255) {
                throw new Error(
                    "Values must be between 0 and 255 (inclusively) or boolean values."
                );
            }
            if (this.invert) {
                value = 255 - value;
            }
            this.pin.pwmWrite(value);
        } else {
            if (this.invert) {
                value = !value;
            }
            this.pin.digitalWrite(value ? 1 : 0);
        }
    }
}

export default LED;
