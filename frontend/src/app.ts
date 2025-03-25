import { GraphComponent, GraphViewerInputMode, HierarchicalLayout, IGraph, INode, LayoutExecutor, License, Rect } from '@yfiles/yfiles';

import LicenseContent from '../yfiles-lib/license.json';

License.value = LicenseContent as any

let gc: GraphComponent;
let graph: IGraph;

// Interface for a .NET object reference.
interface DotNetHelper {
    invokeMethodAsync: <T>(methodName: string, ...args: any[]) => Promise<T>
}

export function initializeGraph(selector: string, dotNetHelper: DotNetHelper) {
    // First, initialize the graph:
    gc = new GraphComponent(selector);
    graph = gc.graph;

    // Create a GraphViewerInputMode, add a canvasClickedListener and an itemClickedListener to the input mode.
    const inputMode = new GraphViewerInputMode();

    inputMode.addEventListener('canvas-clicked', () => {
        // If the canvas is clicked (and not an item), reset the SelectedPerson.
        dotNetHelper.invokeMethodAsync('SetSelectedPerson', -1);
    })

    inputMode.addEventListener('item-clicked', (args) => {
        let id = -1;

        // If the clicked item is a node, ...
        if ((args.item instanceof INode)) {
            const node = args.item as INode;
            // ... set the id to the node's id.
            id = parseInt(node.tag);
        }

        // Then call the according .NET method on the .NET object.
        dotNetHelper.invokeMethodAsync('SetSelectedPerson', id);
    })
    
    gc.inputMode = inputMode;
}

// A rectangle type that matches the one used by CommunicatorService.cs
type Rectangle = {
    x: number,
    y: number,
    width: number,
    height: number
}

// Array of all nodes with their id stored in their tag.
const nodes: INode[] = []

let nodeIdCounter = -1;
export function createNode(label: string, rect: Rectangle): number {
    // Create a node at the specified position with the specified width and height. Store an id in the node's tag.
    nodeIdCounter++;
    const node = graph.createNode({ layout: new Rect(rect.x, rect.y, rect.width, rect.height), tag: nodeIdCounter });
    
    // Add a label to the node.
    graph.addLabel(node, label);

    // Store the newly created node in the array of all nodes
    nodes.push(node);

    // Return the node's id to allow the backend to create edges between nodes
    return nodeIdCounter;
}

export function createEdge(nodeId1: number, nodeId2: number) {
    // Get the nodes from the ids:
    const node1 = nodes.find(n => n.tag === nodeId1);
    const node2 = nodes.find(n => n.tag === nodeId2);

    // Add an edge if the nodes exist.
    if (node1 !== undefined && node2 !== undefined) {
        graph.createEdge(node1, node2);
    }
}

// Make sure layout module is loaded
LayoutExecutor.ensure()

export function applyHierarchicalLayout() {
    // Applying a hierarchical layout in an animated fashion.
    gc.applyLayoutAnimated({
        layout: new HierarchicalLayout(),
        animationDuration: '0.2s'
    });
}
