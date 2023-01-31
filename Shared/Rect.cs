namespace yFilesWASM.Communicator;

public struct Rect
{
    public double X { get; set; }
    public double Y { get; set; }
    public double Width { get; set; }
    public double Height { get; set; }

    public Rect(double x, double y, double width, double height)
    {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }
}