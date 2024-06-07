type InputTuple = [number, string];
type OutputTuple = [number, string];

function transformFunction(func: (x: number, y: number) => number[]): (inputs: InputTuple[]) => OutputTuple[] {
    return (inputs: InputTuple[]) => {
        return inputs.map(([value, name]) => {
            const [x, y] = func(value, value);
            return name === "input1" ? [y, name] : [x, name];
        });
    };
}

// Example usage:
const originalFunction = (x: number, y: number) => [y * 2, x * 2];
const inputTuples: InputTuple[] = [
    [5, "input1"],
    [10, "input2"]
];

const transformedFunction = transformFunction(originalFunction);
console.log(transformedFunction(inputTuples)); // Output: [[20, "input2"], [10, "input1"]]
