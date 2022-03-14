import { LED, Animation } from "../src";

function run() {
    // Create your LED
    const led = new LED(3);

    // Create an animation with a custom Curve function and options.
    //  For every time this animation refreshes, it calls our function and uses
    //  the output as the PWM to write to the LED. In this case, say the
    //  animation ends up refreshing at 750ms after construction.
    //  (750 / 400) % 1 = 0.875. The LED will pulse modulate such that it is lit
    //  up ~87.5% of the time, and turned off ~12.5% of the time until the
    //  program exits, or it is overwritten.
    led.animate(
        new Animation((time: number) => {
            return (time / 400) % 1;
        })
    );

    // Start the animation. This creates a Node.js timer.
    led.startAnimation();

    setTimeout(() => {
        // Stop the animation. Does not turn off the LEDs, and whatever the
        //  state they were in on the last refresh is persisted until
        //  overwritten.
        led.stopAnimation();

        // Turn off the LED. Also stops the animation, if we hadn't previously
        //  called stopAnimation()
        led.off();
    }, 17); // 60 fps is once every 16ms. This will allow our LED to refresh
    //  exactly once before turning off.
}

export default run;
