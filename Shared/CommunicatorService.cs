using Microsoft.JSInterop;

namespace yFilesWASM.Communicator;

public class CommunicatorService
{

    // 'JS' is used to invoke JavaScript functions.
    private readonly IJSRuntime JS;

    // Blazor will automatically provide an instance of 'IJSRuntime' as an injection.
    public CommunicatorService(IJSRuntime js)
    {
        this.JS = js;
    }

    // This method invokes the 'initializeGraph' function.
    public async Task InitializeGraphAsync<T>(string selector, DotNetObjectReference<T> objRef) where T : class
    {
        await JS.InvokeVoidAsync("initializeGraph", selector, objRef);
    }

    // This method invokes the 'createNode' function.
    public async Task<int> CreateNodeAsync(string label, Rect? rect)
    {
        return await JS.InvokeAsync<int>("createNode", label, rect);
    }

    // This method invokes the 'createEdge' function.
    public async Task CreateEdgeAsync(int nodeId1, int nodeId2)
    {
        await JS.InvokeVoidAsync("createEdge", nodeId1, nodeId2);
    }

    // This method invokes the 'applyHierarchicLayout' function.
    public async Task ApplyHierarchicLayout()
    {
        await JS.InvokeVoidAsync("applyHierarchicLayout");
    }
}