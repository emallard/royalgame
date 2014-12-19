
module game2
{

    export class ShadowComputer
    {

        cubes:Cube[];

        setCubes(cubes:Cube[])
        {
            this.cubes = cubes;
        }

        getShadows(cube:Cube)
        {
            var x = cube.min[0];
            var y = cube.min[1];
            var z = cube.min[2];

            var d = 2;

            var atSouthEast = this.checkCubeAt (x + d,  y - d,  z + 1);
            var atEast      = this.checkCubeAt (x + d,  y,      z + 1);
            var atNorthEast = this.checkCubeAt (x + d,  y + d,  z + 1);

            var atSouthWest = this.checkCubeAt (x - d,  y - d,  z + 1);
            var atWest      = this.checkCubeAt (x - d,  y,      z + 1);
            var atNorthWest = this.checkCubeAt (x - d,  y + d,  z + 1);

            var atNorth     = this.checkCubeAt (x,      y + d,  z + 1);
            var atSouth     = this.checkCubeAt (x,      y - d,  z + 1);

            var atSide      = this.checkCubeAt (x - d,  y - d,  z);

            var shadows = [];
            var test = function(b:boolean, id:string)
            {
                if (b) {
                    shadows.push(id);
                };
            };

            test (atSouthEast && !atEast, "shadowSouthEast");
            test (atSouth, "shadowSouth");
            test (atSouthWest && !atWest, "shadowSouthWest");

            test (atEast, "shadowEast");
            test (atWest, "shadowWest");

            test (atNorthEast && !atEast && !atNorth, "shadowNorthEast");
            test (atNorth, "shadowNorth");
            test (atNorthWest && !atWest && !atNorth, "shadowNorthWest");

            test (atSide, "shadowSide");

            return shadows;
        }

        checkCubeAt(i:number, j:number, k:number)
        {
            var _i,len = this.cubes.length;
            for (_i=0; _i<len; ++_i)
            {
                var c = this.cubes[_i];
                if (c.min[0] == i && c.min[1] == j && c.min[2] == k)
                {
                    return true;
                }
            }
            return false;
        }
    }

}