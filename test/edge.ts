import { Vec3 } from "../src/types";

export class Edge {
  vertices: [Vec3, Vec3];

  constructor(p1: Vec3, p2: Vec3) {
    this.vertices = [p1, p2];
  }
}
