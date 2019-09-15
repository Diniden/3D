import { Vec3 } from "../src";
import { Edge } from "./edge";

export class Face {
  vertices: [Vec3, Vec3, Vec3];
  edges: [Edge, Edge, Edge];

  constructor(p1: Vec3, p2: Vec3, p3: Vec3) {
    this.vertices = [p1, p2, p3];
    this.edges = [
      new Edge(p1, p2),
      new Edge(p2, p3),
      new Edge(p3, p1)
    ];
  }
}
