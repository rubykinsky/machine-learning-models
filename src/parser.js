import { IModel, readModelFile } from './io';

export function parseModel(modelPath: string): IModel {
  const model = readModelFile(modelPath);
  const { name, layers } = model;

  return {
    name,
    layers: layers.map((layer) => {
      const { type, ...rest } = layer;
      switch (type) {
        case 'dense':
          return {
            ...rest,
            activation: rest.activation || 'relu',
            kernelInitializer: rest.kernel_initializer || 'glorot_uniform',
            useBias: rest.use_bias || true,
          };
        case 'conv2d':
          return {
            ...rest,
            activation: rest.activation || 'relu',
            padding: rest.padding || 'same',
            kernelInitializer: rest.kernel_initializer || 'glorot_uniform',
          };
        case 'flattening':
          return rest;
        default:
          throw new Error(`Unsupported layer type: ${type}`);
      }
    }),
  };
}