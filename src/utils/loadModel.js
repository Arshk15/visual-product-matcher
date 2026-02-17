import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

export async function loadModel() {
  const model = await mobilenet.load();
  return model;
}
