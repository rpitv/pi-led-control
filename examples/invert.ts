import { LED } from "../src";

function run() {
    // Create your LED with an inverted signal. This is useful if you have a
    //  transistor chip which also inverts the signal, so you need to double
    //  invert.
    const led = new LED(3, true);
    // Turn on the LED. The output from the GPIO pin will be low (aka false/0)
    led.write(true);
    // Turn off the LED.
    led.off();

    // Write a PWM value of 153. This will be inverted as well, so instead of
    //  the output from the GPIO pin being on 60% of the time, it's off 60% of
    //  the time.
    led.write(153);
    // Turn off the LED.
    led.off();
}

export default run;
