import { Graph, json } from '@dagrejs/graphlib';

export default class Pipeline extends Graph {
  public static createFromString(encoded: string): Pipeline {
    const graph = json.read(JSON.parse(encoded) as object);
    return graph;
  }

  public static createFromJSON(encoded: object): Pipeline {
    const graph = json.read(encoded);
    return graph;
  }
}
