import { LED, Animation, Curves } from "../src";

function run() {
    // Create your LED
    const led = new LED(3);

    // Refresh rate in milliseconds for which the Animation should refresh at.
    //  Optional, defaults to 60fps.
    const refreshRate = Math.floor((1 / 15) * 1000);
    // Whether the Animation should automatically start upon construction.
    //  Optional, defaults to true.
    const autoStart = false;
    // Period of the Curve function along the X axis (milliseconds). Required.
    const period = 1000;
    // Create an animation with a provided Curve function and options.
    led.animate(new Animation(Curves.Sine(period), refreshRate), autoStart);
    // Without the optional values:
    // led.animate(new Animation(Curves.Sine(1000)));

    // Start the animation. This creates a Node.js timer.
    led.startAnimation();

    // This write() will succeed, but it will be immediately overwritten on the
    //  next frame of the animation.
    led.write(true);

    // Stop the animation. Does not turn off the LEDs, and whatever the state
    //  they were in on the last refresh is persisted until overwritten.
    led.stopAnimation();

    // Turn off the LED. Also stops the animation, if we hadn't previously
    //  called stopAnimation()
    led.off();
}

export default run;
