class Curves {
    public static Square(frequency: number): (time: number) => number {
        return (time: number): number => {
            return Math.ceil(Math.sin(time * frequency));
        };
    }

    public static Sawtooth(frequency: number): (time: number) => number {
        return (time: number): number => {
            return (time * frequency) % 1;
        };
    }

    public static Sine(frequency: number): (time: number) => number {
        return (time: number): number => {
            return (Math.sin(time * frequency) + 1) / 2;
        };
    }
}

export default Curves;
