import { GraphComponent, GraphViewerInputMode, HierarchicalLayout, IGraph, INode, LayoutExecutor, License, Rect as yRect } from '@yfiles/yfiles';

import LicenseContent from '../yfiles-lib/license.json';

License.value = LicenseContent as any

let gc: GraphComponent;
let graph: IGraph;

// Interface for a .NET object reference.
interface DotNetHelper {
    invokeMethodAsync: <T>(methodName: string, ...args: any[]) => Promise<T>
}

// Function, which returns the corresponding id to a node.
function getIdFromNode(node: INode): number | undefined {
    for (let i of nodes) {
        if (i[1] === node) {
            return i[0];
        }
    }
    return undefined;
}

export function initializeGraph(selector: string, dotNetHelper: DotNetHelper) {
    // First, initialize the graph:
    gc = new GraphComponent(selector);
    graph = gc.graph;

    // Create a GraphViewerInputMode and add a canvasClickedListener and an itemClickedListener to the input mode.
    let inpMode = new GraphViewerInputMode();
    
    inpMode.addEventListener('canvas-clicked', () => {
        // If the canvas is clicked (and not an item), reset the SelectedPerson.
        dotNetHelper.invokeMethodAsync('SetSelectedPerson', -1);
    })

    inpMode.addEventListener('item-clicked', (args) => {
        let id = -1;

        // If the clicked item is a node, ...
        if ((args.item instanceof INode)) {
            const node = args.item as INode;
            // ... set the id to the node's id.
            id = getIdFromNode(node)!;
        }

        // Then call the according .NET method on the .NET object.
        dotNetHelper.invokeMethodAsync('SetSelectedPerson', id);
    })
    
    gc.inputMode = inpMode;
}

interface Rect {
    x: number,
    y: number,
    width: number,
    height: number
}

// 'nodes' keeps the ids with the corresponding nodes.
const nodes: [number, INode][] = [];

let nodeIdCount = 0;
export function createNode(label: string, rect: Rect | null): number {
    // Create a rect at the specified position with the specified width and height.
    const node = rect === null 
        ? graph.createNode()
        : graph.createNode(new yRect(rect.x, rect.y, rect.width, rect.height));
    
    // Add a label to the node.
    graph.addLabel(node, label);

    // Assign an id to the node, store it and return the id.
    let id = nodeIdCount++;
    nodes.push([id, node]);
    return id;
}

// Function, which returns the corresponding node to an id.
function getNodeFromId(id: number): INode | undefined {
    for (let i of nodes) {
        if (i[0] === id) {
            return i[1];
        }
    }
    return undefined;
}

export function createEdge(nodeId1: number, nodeId2: number) {
    // Get the nodes from the ids:
    const node1 = getNodeFromId(nodeId1);
    const node2 = getNodeFromId(nodeId2);

    // Add an edge if the nodes exist.
    if (node1 !== undefined && node2 !== undefined) {
        graph.createEdge(node1, node2);
    }
}

// make sure layout module is loaded
LayoutExecutor.ensure()

export function applyHierarchicLayout() {
    // Applying a hierarchic layout in an animated fashion.
    gc.applyLayoutAnimated({
        layout: new HierarchicalLayout(),
        animationDuration: '0.2s'
    });
}
