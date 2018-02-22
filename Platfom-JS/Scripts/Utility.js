
// Utilities for in-Game
function CreateABox ()
{
    let newBox = new Box();
    return newBox;
}

function Box ( )
{
    this.x = 0;
    this.y = 0;
    this.w = 0; 
    this.h = 0;
    
    this.color = ""; //"red"
    this.force = 0;

    this.SetY = function ( y ) { this.y = y; }
    this.SetForce = function ( force ) 
    { 
        this.force = force; 
        //console.log(this.force);
        if ( Math.abs ( this.force ) > this.Maxforce() )
        {
            this.force = Math.sign ( this.force ) * this.Maxforce();
        }
    }
    this.Maxforce = function () { return MaxForceInAnyDirection; }

    this.isKinematic = true;
    
    this.SetPosition = function ( x, y ) { this.x = x; this.y = y; }
    this.SetDimention = function ( w, h ) { this.w = w; this.h = h; }
    this.SetColor = function ( color ) { this.color = color; }
    this.SetKinematic = function ( isKinematic ) { this.isKinematic = isKinematic; }

    this.SetAll = function ( x, y, w, h, color, isKinematic ) { this.SetPosition ( x, y ); this.SetDimention ( w, h ); this.SetColor ( color ); this.SetKinematic(isKinematic); }
    this.IsAffectedByGravity = function() { return !this.isKinematic; }
    this.IncreaseForce = function ( value ) 
    { 
        this.force = this.force + value;  
        //console.log(this.force);
        if ( Math.abs ( this.force ) > this.Maxforce() )
        {
            this.force = Math.sign ( this.force ) * this.Maxforce();
        }
    }

    this.Update  = function ( )
    {
        if ( this.upwardForceCooldown > 0 )
            this.upwardForceCooldown -= dt/1000;
    }

    this.SetUpwardForce = function ( force ) 
    { 
        if ( this.upwardForceCooldown > 0 )
            return;

        console.log("SetUpwardForce " + this.upwardForceCooldown )
        this.upwardForceCooldown = protogonistUpwardForceCoolDownTime;

        this.SetForce ( force );
    }

    this.upwardForceCooldown = 0;

}


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RemoveFromArray ( array, value )
{
    let index = array.indexOf ( value );
    if ( index >= 0 )
    {
        //console.log ("Splicing:" + index + " " + obstacles.length);
        array.splice ( index, 1 );
        //console.log ("After Splicing:" + index + " " + obstacles.length);
    }
}
function DoesArrayContains ( array, value )
{
    let index = array.indexOf ( value );
    if ( index >= 0 )
    {
        return true;
    }
    return false;
}