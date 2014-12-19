module game2
{

    export class Cube
    {
        min: number[] = [0, 0, 0];
        max: number[] = [1, 1, 1];

        setFrom(cube:Cube)
        {
            var newMin = this.min;
            var newMax = this.max;
            for (var i = 0; i < 3; ++i)
            {
                newMin[i] = cube.min[i];
                newMax[i] = cube.max[i];
            }
        }

        setMinMax(_min:number[], _max:number[])
        {
            var newMin = this.min;
            var newMax = this.max;
            for (var i = 0; i < 3; ++i)
            {
                newMin[i] = _min[i];
                newMax[i] = _max[i];
            }
        }

        toString():string
        {
            var min = this.min;
            var max = this.max;
            return min[0] + "," + min[1] + "," + min[2] + " | " + max[0] + "," + max[1] + "," + max[2];
        }
    }
}