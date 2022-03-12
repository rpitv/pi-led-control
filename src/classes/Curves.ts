/**
 * Curves is not a class which should be instantiated. Instead, it is a
 *  collection of curve function generators. Curve functions are functions which
 *  generate waveforms that can be passed to Animations.
 */
class Curves {
    /**
     * Create a square waveform Curve function. Returns another function which
     *  you may pass into your Animations.
     * @param frequency Frequency multiplier for the waveform. A higher number
     *  means the wave will repeat more frequently.
     * @constructor
     */
    public static Square(frequency: number): (time: number) => number {
        return (time: number): number => {
            return Math.ceil(Math.sin(time * frequency));
        };
    }

    /**
     * Create a sawtooth waveform Curve function. Returns another function which
     *  you may pass into your Animations.
     * @param frequency Frequency multiplier for the waveform. A higher number
     *  means the wave will repeat more frequently.
     * @constructor
     */
    public static Sawtooth(frequency: number): (time: number) => number {
        return (time: number): number => {
            return (time * frequency) % 1;
        };
    }

    /**
     * Create a sine waveform Curve function. Returns another function which
     *  you may pass into your Animations.
     * @param frequency Frequency multiplier for the waveform. A higher number
     *  means the wave will repeat more frequently.
     * @constructor
     */
    public static Sine(frequency: number): (time: number) => number {
        return (time: number): number => {
            return (Math.sin(time * frequency) + 1) / 2;
        };
    }
}

export default Curves;
