import type { WorkflowNode } from '../parsers/models/workflowNode';
import { isWorkflowNode } from '../parsers/models/workflowNode';
import { useReadOnly } from '../state/designerOptions/designerOptionsSelectors';
import { getRootWorkflowGraphForLayout } from '../state/workflow/workflowSelectors';
import { LogEntryLevel, LoggerService, Status } from '@microsoft/designer-client-services-logic-apps';
import { useThrottledEffect, WORKFLOW_NODE_TYPES, WORKFLOW_EDGE_TYPES } from '@microsoft/utils-logic-apps';
import type { ElkExtendedEdge, ElkNode } from 'elkjs/lib/elk.bundled';
import ELK from 'elkjs/lib/elk.bundled';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { Edge, Node } from 'reactflow';

export const layerSpacing = {
  default: '64',
  readOnly: '48',
  onlyEdge: '16',
};

const defaultLayoutOptions: Record<string, string> = {
  'elk.algorithm': 'org.eclipse.elk.layered',
  'elk.direction': 'DOWN',
  'elk.alignment': 'TOP',
  'elk.layered.layering.strategy': 'INTERACTIVE',
  'elk.edge.type': 'DIRECTED',
  'elk.layered.unnecessaryBendpoints': 'false',
  'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
  'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
  'elk.layered.nodePlacement.bk.fixedAlignment': 'BALANCED',
  'elk.layered.spacing.edgeEdgeBetweenLayers': '0',
  'elk.layered.spacing.edgeNodeBetweenLayers': layerSpacing.default,
  'elk.layered.spacing.nodeNodeBetweenLayers': layerSpacing.default,
  'elk.padding': '[top=0,left=16,bottom=16,right=16]',
  // This option allows the first layer children of a graph to be laid out in order of appearance in manifest. This is useful for subgraph ordering, like in Switch nodes.
  // 'elk.layered.crossingMinimization.semiInteractive': 'true',
  'elk.layered.crossingMinimization.forceNodeModelOrder': 'false',
  'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
};

const readOnlyOptions: Record<string, string> = {
  'elk.layered.spacing.edgeNodeBetweenLayers': layerSpacing.readOnly,
  'elk.layered.spacing.nodeNodeBetweenLayers': layerSpacing.readOnly,
};

const elk = new ELK();
const defaultEdgeType = WORKFLOW_EDGE_TYPES.BUTTON_EDGE;
const defaultNodeType = WORKFLOW_NODE_TYPES.OPERATION_NODE;

const elkLayout = async (graph: ElkNode, readOnly?: boolean) => {
  const layout = await elk.layout(JSON.parse(JSON.stringify(graph)), {
    layoutOptions: {
      ...defaultLayoutOptions,
      ...(readOnly && readOnlyOptions),
    },
  });
  return layout;
};

const convertElkGraphToReactFlow = (graph: ElkNode): [Node[], Edge[], number[]] => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let flowWidth: number = graph?.width ?? 0;
  let flowHeight: number = graph?.height ?? 0;

  const processChildren = (node: ElkNode) => {
    if (node.edges) {
      for (const edge of node.edges as ElkExtendedEdge[]) {
        edges.push({
          id: edge.id,
          target: edge.targets[0],
          source: edge.sources[0],
          type: edge.layoutOptions?.['edgeType'] ?? defaultEdgeType,
          data: {
            elkEdge: edge,
          },
        });
      }
    }

    if (node.children) {
      for (const n of node.children as ElkNode[]) {
        nodes.push({
          id: n.id,
          position: { x: n.x ?? 0, y: n.y ?? 0 },
          data: { label: n.id },
          parentNode: node.id !== 'root' ? node.id : undefined,
          type: n.layoutOptions?.['nodeType'] ?? defaultNodeType,
          style: n?.children && n?.height ? { height: n?.height, width: n?.width } : undefined,
        });

        const farWidth = (n?.x ?? 0) + (n?.width ?? 0);
        const farHeight = (n?.y ?? 0) + (n?.height ?? 0);
        if (farWidth > flowWidth) flowWidth = farWidth;
        if (farHeight > flowHeight) flowHeight = farHeight;

        processChildren(n);
      }
    }
  };
  processChildren(graph);
  return [nodes, edges, [flowWidth, flowHeight]];
};

const convertWorkflowGraphToElkGraph = (node: WorkflowNode): ElkNode => {
  if (isWorkflowNode(node)) {
    return {
      id: node.id,
      height: node.height,
      width: node.width,
      edges: undefined, // node has no edges
      children: node.children?.map(convertWorkflowGraphToElkGraph),
      layoutOptions: {
        nodeType: node?.type ?? defaultNodeType,
      },
    };
  } else {
    const children = node.children?.map(convertWorkflowGraphToElkGraph);
    return {
      id: node.id,
      height: node.height,
      width: node.width,
      children,
      edges:
        node.edges?.map((edge) => ({
          id: edge.id,
          sources: [edge.source],
          targets: [edge.target],
          layoutOptions: {
            edgeType: edge?.type ?? defaultEdgeType,
          },
        })) ?? [],
      layoutOptions: {
        'elk.padding': '[top=0,left=16,bottom=48,right=16]', // allow space for add buttons
        'elk.position': `(0, 0)`, // See 'crossingMinimization.semiInteractive' above
        nodeType: node?.type ?? WORKFLOW_NODE_TYPES.GRAPH_NODE,
        ...(node.edges?.some((edge) => edge.type === WORKFLOW_EDGE_TYPES.ONLY_EDGE) && {
          'elk.layered.nodePlacement.strategy': 'SIMPLE',
          'elk.layered.spacing.edgeNodeBetweenLayers': layerSpacing.onlyEdge,
          'elk.layered.spacing.nodeNodeBetweenLayers': layerSpacing.onlyEdge,
          'elk.layered.crossingMinimization.forceNodeModelOrder': 'true',
        }),
        ...(node.children?.findIndex((child) => child.id.endsWith('#footer')) !== -1 && {
          'elk.padding': '[top=0,left=16,bottom=0,right=16]',
        }),
      },
    };
  }
};

export const useLayout = (): [Node[], Edge[], number[]] => {
  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);
  const [reactFlowSize, setReactFlowSize] = useState<number[]>([0, 0]);
  const workflowGraph = useSelector(getRootWorkflowGraphForLayout);

  const readOnly = useReadOnly();

  useThrottledEffect(
    () => {
      if (!workflowGraph) return;
      const elkGraph: ElkNode = convertWorkflowGraphToElkGraph(workflowGraph);
      const traceId = LoggerService().startTrace({
        action: 'useLayout',
        actionModifier: 'run Elk Layout',
        name: 'Elk Layout',
        source: 'elklayout.ts',
      });
      elkLayout(elkGraph, readOnly)
        .then((g) => {
          const [n, e, s] = convertElkGraphToReactFlow(g);
          setReactFlowNodes(n);
          setReactFlowEdges(e);
          setReactFlowSize(s);
          LoggerService().endTrace(traceId, { status: Status.Success });
        })
        .catch((err) => {
          LoggerService().log({
            level: LogEntryLevel.Error,
            area: 'useLayout',
            error: err,
            message: err.message,
            traceId: traceId,
          });
          LoggerService().endTrace(traceId, { status: Status.Failure });
        });
    },
    [readOnly, workflowGraph],
    200
  );

  return [reactFlowNodes, reactFlowEdges, reactFlowSize];
};

export const exportForTesting = {
  convertElkGraphToReactFlow,
  convertWorkflowGraphToElkGraph,
  elkLayout,
};
