/**
 * Curves is not a class which should be instantiated. Instead, it is a
 *  collection of curve function generators. Curve functions are functions which
 *  generate waveforms that can be passed to Animations.
 */
class Curves {
    /**
     * Create a square waveform Curve function. Returns another function which
     *  you may pass into your Animations.
     * @param period Period of the waveform in milliseconds.
     * @constructor
     */
    public static Square(period: number): (time: number) => number {
        return (time: number): number => {
            return Math.ceil(Math.sin((time / period) * Math.PI));
        };
    }

    /**
     * Create a sawtooth waveform Curve function. Returns another function which
     *  you may pass into your Animations.
     * @param period Period of the waveform in milliseconds.
     * @constructor
     */
    public static Sawtooth(period: number): (time: number) => number {
        return (time: number): number => {
            return (time / period) % 1;
        };
    }

    /**
     * Create a sine waveform Curve function. Returns another function which
     *  you may pass into your Animations.
     * @param period Period of the waveform in milliseconds.
     * @constructor
     */
    public static Sine(period: number): (time: number) => number {
        return (time: number): number => {
            return (Math.sin((time / period) * 2 * Math.PI) + 1) / 2;
        };
    }
}

export default Curves;
