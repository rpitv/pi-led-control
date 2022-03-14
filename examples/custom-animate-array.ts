import { Animation, LEDArray } from "../src";

function run() {
    // Create your LED
    const led = new LEDArray([3, 4, 5]);

    // This is another way to write animations for LEDArrays. This allows a lot
    //  of flexibility as you can create an animation for each individual LED.
    //  Since each one now has its own animation, you no longer need the array
    //  of values for proportions like we did in the basic-animate-array
    //  example.
    led.animate([
        new Animation((t: number) => {
            return (Math.sin(t / 1000) + 1) / 2; // Sin wave w/ period 1000ms
        }),
        new Animation((t: number) => {
            return (Math.sin(t / 750) + 1) / 2; // Sin wave w/ period 750ms
        }),
        new Animation((t: number) => {
            return (Math.sin(t / 333) + 1) / 2; // Sin wave w/ period 333ms
        }),
    ]);

    // Start the animation. This creates a Node.js timer.
    led.startAnimation();

    setTimeout(() => {
        // Stop the animation. Does not turn off the LEDs, and whatever the
        //  state they were in on the last refresh is persisted until
        //  overwritten.
        led.stopAnimation();

        // Turn off the LEDs. Also stops the animation, if we hadn't previously
        //  called stopAnimation()
        led.off();
    }, 17); // 60 fps is once every 16ms. This will allow our LEDs to
    //  refresh exactly once before turning off.
}

export default run;
