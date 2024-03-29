import { createReadStream } from "fs";
import { createInterface } from "readline";

let measurements = new Map();

function aggregate1(path) {
    const data = createInterface({
        input: createReadStream(path),
        output: process.stdout,
        terminal: false,
    });

    data.on("line", (chunk) => {
        const line = chunk.split(";");
        if (measurements.has(line[0])) {
            const atofValue = atof(line[1]);
            const measurement = measurements.get(line[0]);
            measurement.sum += atofValue;
            measurement.min = Math.min(measurement.min, atofValue);
            measurement.max = Math.max(measurement.max, atofValue);
            measurement.count++;
        } else {
            const atofValue = atof(line[1]);
            measurements.set(line[0], {
                min: atofValue,
                max: atofValue,
                sum: atofValue,
                count: 1,
            });
        }
    });

    data.on("close", () => {
        for (const [key, value] of measurements.entries()) {
            measurements.set(key, {
                ...value,
                average: (value.sum / value.count).toFixed(1),
            });
        }
        printMeasurements(measurements);
    });
}

function atof(value) {
    let result = 0;
    let isNegative = false;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === "-") {
            i++;
            isNegative = true;
        }
        if (value[i] === ".") {
            let decimal = 0;
            let j = 1;
            while (value[i + j] !== undefined) {
                decimal += parseInt(value[i + j]) / Math.pow(10, j);
                j++;
            }
            result += decimal;
            break;
        }
        result = result * 10 + parseInt(value[i]);
    }

    if (isNegative) {
        return -result;
    }
    return result;
}

function printMeasurements(measurements) {
    let result = "{";
    const sortedMeasurements = new Map(
        [...measurements.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    );

    for (const [key, value] of sortedMeasurements) {
        result += `${key}=${value.min}/${value.average}/${value.max}, `;
    }

    result = result.slice(0, -2);
    result += "}";
    console.log(result);
}

aggregate1("../1brc/measurements.txt");
