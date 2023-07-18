import { Graph, json } from '@dagrejs/graphlib';
import { isAcyclic } from '@dagrejs/graphlib/lib/alg';

export type PipelineNodeObject = {
  edges: object[];
  nodes: object[]
  options: object;
};

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

  public static tryCreateFromJSON(encoded: object, options?: object): Pipeline | null {
    try {
      const graph = json.read({
        ...encoded,
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

  public static getEdgesNames(pipeline: Pipeline | null, v: string): string[] {
    const edges = pipeline?.outEdges(v);
    if (!edges) {
      return [];
    }
    return edges.map((edge) => edge.w);
  }

  public static checkAcyclic(pipeline: Pipeline): boolean {
    const acyclic = isAcyclic as (pipeline: Pipeline) => boolean;
    return acyclic(pipeline);
  }

  public static pipelineToString(pipeline: Pipeline): string {
    const result = json.write(pipeline) as PipelineNodeObject;
    delete result.options;
    return JSON.stringify(result);
  }

  public static pipelineToObject(pipeline: Pipeline): object {
    const result = json.write(pipeline) as PipelineNodeObject;
    delete result.options;
    return result;
  }
}
