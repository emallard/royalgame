module game2
{
    export class CubeViewModel
    {
        cssId = ko.observable<string>();
        cube = ko.observable<Cube>(new Cube());
        isNb = ko.observable(false);

        setCssNb(isNb:boolean)
        {
            this.isNb(isNb);
        }

        setCube(cube:Cube)
        {
            var c = new Cube();
            c.setFrom(cube);
            this.cube(c);
        }

        setCubeMinMax(min: number[], max:number[])
        {
            var c = new Cube();
            c.setMinMax(min, max);
            this.cube(c);
        }

    }
}