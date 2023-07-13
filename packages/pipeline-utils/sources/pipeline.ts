import { Graph, json } from '@dagrejs/graphlib';
import { isAcyclic } from '@dagrejs/graphlib/lib/alg';

export default class Pipeline extends Graph {
  public static tryCreateFromString(encoded: string, options?: object): Pipeline | null {
    try {
      const data = JSON.parse(encoded) as object;
      const graph = json.read({
        ...data,
        options: options ?? {
          directed: true,
          multigraph: false,
          compound: false,
        },
      });
      return graph;
    } catch {
      return null;
    }
  }

  public static tryCreateFromJSON(encoded: object): Pipeline | null {
    try {
      const graph = json.read(encoded);
      return graph;
    } catch {
      return null;
    }
  }

  public static getEdgesNames(pipeline: Pipeline | null, v: string): string[] {
    const edges = pipeline?.nodeEdges(v);
    if (!edges) {
      return [];
    }
    return edges.map((edge) => edge.w);
  }

  public static checkAcyclic(pipeline: Pipeline): boolean {
    const acyclic = isAcyclic as (pipeline: Pipeline) => boolean;
    return acyclic(pipeline);
  }
}
