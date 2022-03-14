import { LED } from "../src";

function run() {
    // Create your LED
    const led = new LED(3);
    // Turn on the LED
    led.write(true);
    // Turn off the LED. Note, if you use led.animate(), this will stop the
    //  animation while using write(false) will not.
    led.off();

    // Write a PWM value of 153. This does not mean the LED will be on at 60%
    //  brightness 100% of the time. Instead, it means the LED will be at
    //  100% brightness 60% of the time, and 0% brightness (off) 40% of the
    //  time. To the naked eye, these will look the same anyway.
    led.write(153);
    // Turn off the LED. Note, since pulse modulation requires the program to
    //  be running, if you do not set your LEDs to be either off or on before
    //  your program exits, whatever the last pulse they received will persist
    //  until overwritten by another process. E.g., with our last write() call,
    //  60% of the time when the program stops, our LED will remain on. The
    //  other 40% of the time it will remain off.
    led.off();
}

export default run;
