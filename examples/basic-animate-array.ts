import { Animation, Curves, LEDArray } from "../src";

function run() {
    // Create your LED
    const led = new LEDArray([3, 4, 5]);

    // Create an animation with a provided Curve function and options.
    //  There are multiple overloads of the LEDArray#animate() function. Check
    //  docs for more options. This one will animate the LEDs so that the ratio
    //  of brightness between each one is always the same. I.e., when the
    //  animation is at 30% brightness, the brightness of each LED value in the
    //  array is multiplied by 0.3.
    led.animate(new Animation(Curves.Sawtooth(500)), [255, 50, 170]);

    // Start the animation. This creates a Node.js timer.
    led.startAnimation();

    // This write() will succeed, but it will be immediately overwritten on the
    //  next frame of the animation.
    led.write(true, false, true);

    // Stop the animation. Does not turn off the LEDs, and whatever the state
    //  they were in on the last refresh is persisted until overwritten.
    led.stopAnimation();

    // Turn off the LED. Also stops the animation, if we hadn't previously
    //  called stopAnimation()
    led.off();
}

export default run;
