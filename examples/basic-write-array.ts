import { LEDArray } from "../src";

function run() {
    // Create your LEDArray. Technically each pin can appear multiple times in
    //  the same array, but there are probably not many cases where you would
    //  ever want this.
    const led = new LEDArray([3, 4, 5]);
    // Turn on all three LEDs.
    led.write(true, true, true);
    // Turn off three LEDs.
    led.off();
    // Write different PWM values for each LED. These PWMs will immediately stop
    //  as soon as the program exits, as mentioned in easier examples.
    led.write(255, 128, 40);
}

export default run;
