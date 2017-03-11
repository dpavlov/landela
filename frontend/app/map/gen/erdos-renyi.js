export default class ErdosRenyi {
  static np(n, p) {
    var graph = { nodes: [], edges: [] },
    i, j;
    for (i = 0; i < n; i++) {
      graph.nodes.push({ id: 'n' + i });
      for (j = 0; j < i; j++) {
        if (Math.random() < p) {
          graph.edges.push({
            source: 'n' + i,
            target: 'n' + j
          });
        }
      }
    }
    return graph;
  }
}
