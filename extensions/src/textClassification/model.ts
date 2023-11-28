import { oneHot, type Tensor2D, sequential, tensor1d, train, layers, callbacks, type Sequential, losses } from '@tensorflow/tfjs';
import { load as loadEncoder, type UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';

const outOfDate = { exit: true } as const;

let encoder: UniversalSentenceEncoder;

export type Predictor = { predict: (text: string) => Promise<{ label: string, score: number, index: number }> };
type Error = { error: string };

const exitKey: keyof typeof outOfDate = "exit";
const successkey: keyof Predictor = "predict";
const failureKey: keyof Error = "error";

export const success = (result: Awaited<ReturnType<typeof build>>): result is Predictor =>
    !(failureKey in result) && !(exitKey in result);

export const failure = (result: Awaited<ReturnType<typeof build>>): result is Error =>
    !(successkey in result) && !(exitKey in result);

export const embed = async (text: string) => {
    encoder ??= await loadEncoder();
    return await encoder.embed(text);
}

export const predict = async (text: string, model: Sequential, labels: string[]) => {
    const embeded = await embed(text);
    const result = await model.predict(embeded);
    const singular = Array.isArray(result) ? result[0] : result;
    const predict = await singular.data();
    const index = await singular.as1D().argMax().dataSync()[0];
    return { label: labels[index], score: predict[index], index }
}

export const cosineDistance = async (a: string, b: string) => {
    const distance = losses.cosineDistance(await embed(a), await embed(b), 1).dataSync();
    return distance[0];
}

export const build = async (
    labels: string[],
    modelData: Map<string, string[]>,
    isCurrent: () => boolean,
) => {
    const { length } = labels;

    if (length < 2) return { error: "2 or more classes required" };

    const model = sequential();

    const flatExamples = new Array<string>();
    const flatLabelIndices = new Array<number>();

    for (let index = 0; index < length; index++) {
        const examples = modelData.get(labels[index]);
        flatExamples.push(...examples);
        const getLabelIndex = () => index;
        flatLabelIndices.push(...examples.map(getLabelIndex));
    }

    const ys = oneHot(tensor1d(flatLabelIndices, "int32"), length);

    let trainingData: Tensor2D;
    try {
        encoder ??= await loadEncoder();
        if (!isCurrent()) return outOfDate;
        trainingData = await encoder.embed(flatExamples);
    }
    catch (error) { return { error }; }

    model.add(layers.dense({
        inputShape: [512],
        activation: 'sigmoid',
        kernelInitializer: 'ones',
        units: length,
    }));

    model.compile({ loss: 'meanSquaredError', optimizer: train.adam(.06), });

    if (!isCurrent()) return outOfDate;

    await model.fit(trainingData, ys, {
        epochs: 100,
        batchSize: 4,
        shuffle: true,
        validationSplit: 0.15,
        callbacks: [
            callbacks.earlyStopping({ monitor: 'val_loss', patience: 50 })
        ]
    });

    if (!isCurrent()) return outOfDate;

    return { predict: (text: string) => predict(text, model, labels) } satisfies Predictor;
}