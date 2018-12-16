"use strict";
document.onkeydown = checkDown;
document.onkeyup = checkUp;

// Design data 
const renderWidth = 500;
const renderHeight = 600;
const MAX_ROWS_COLS = 9;

const scaleUp = 1.0;
const gameSpeed = 1;




// Private
let lastUpdate = Date.now();
let dt = 0;
var touchVar = null;
let isGamePaused = false;





// Loads the game up 
function loadGame() 
{
    MyApplicationInstance.Initialize();

    renderer.InitializeGraphics( MyApplicationInstance.GameWidth(), MyApplicationInstance.GameHeight() );
    renderer.ClearScreen();

    //renderer.canvas.addEventListener('click', OnMouseClicked,  false);
    renderer.canvas.addEventListener('mousedown', OnMouseDown,  false);
    renderer.canvas.addEventListener('mouseup', OnMouseUp,  false);

    InitUI( renderer );

    MyApplicationInstance.Start();

    
}
function OnImageLoaded()
{

    //alert ( "here");
}

// My application class which has all important links
var MyApplicationInstance = 
{
    gameWidth : renderWidth,
    gameHeight : renderHeight,

    currentTime : 0,

    GameWidth : function() { return renderWidth; },
    GameHeight : function() { return renderHeight; },

    StateManager : new StateManager(),

    Initialize: function ( )
    {
        this.frameNumber = 0;
        lastUpdate = Date.now();
        
        this.interval = setInterval(this.UpdateGameLoop, 0 );
    },
    Start : function () 
    {
        this.StateManager.PushState( new StartMenuState() );
    },
    Restart: function () 
    {
            
        this.StateManager.ClearAll();
        this.StateManager.PushState( new StartMenuState() );
    },

    // the main update method which updates everything else 
    UpdateGameLoop: function()
    {
        var now = Date.now();
        dt = now - lastUpdate;
        dt = dt * gameSpeed;
        lastUpdate = now;
        dt = dt / 1000; 

        renderer.ClearScreen(); // clearing the screen 
        OnKeyPress(touchVar);   // sending touch events to the game 

        // updating and rendering the states
        if ( MyApplicationInstance.StateManager != null )
        {
            MyApplicationInstance.StateManager.Update( dt );
            MyApplicationInstance.StateManager.Render();
        }
    }
}


// A rendering class which takes care of all rendering 
var renderer = 
{
    canvas : null,
    context : null, 
    InitializeGraphics : function( width, height ) 
    {
        this.canvas = document.getElementById("canvas-game"); // Fetching the game canvas from html
        this.canvas.width = width * scaleUp;    // the window is scaled up based on the scale we set
        this.canvas.height = height * scaleUp; // the window is scaled up based on the scale we set
        this.context = this.canvas.getContext("2d");
    },
    ClearScreen : function() 
    {
        this.context.clearRect(0, 0, this.canvas.width * scaleUp, this.canvas.height * scaleUp);
    },
    RenderBox : function( box, point = null )
    {
        this.context.fillStyle = box.color;
        if ( this.InvertYEnabled() )
        {
            this.context.fillRect((box.x - box.w/2) * scaleUp, (this.Height() - ( box.y + box.h/2 )) * scaleUp , box.w * scaleUp, box.h * scaleUp);
        }
        else
            this.context.fillRect(box.x - box.w/2, box.y - box.h/2, box.w, box.h);
    },
    RenderBox : function( box, point = null )
    {
        this.context.fillStyle = box.color;
        if ( this.InvertYEnabled() )
        {
            this.context.fillRect((box.x - box.w/2) * scaleUp, (this.Height() - ( box.y + box.h/2 ) ) * scaleUp, box.w * scaleUp, box.h * scaleUp);
        }
        else
            this.context.fillRect(box.x - box.w/2, box.y - box.h/2, box.w, box.h);
    },
    RenderText : function ( textUi )
    {
        this.context.fillStyle = textUi.fontColor;
        this.context.font = textUi.fontType;

        if ( this.InvertYEnabled() )
        {
            this.context.fillText( textUi.text, textUi.x * scaleUp, (this.Height() - (textUi.y - textUi.fontHeightInPX/2)) * scaleUp );
        }
        else
            this.context.fillText( textUi.text, textUi.x, (textUi.y - textUi.fontHeightInPX/2));

        this.context.textAlign="center"; 
    },
    RenderButton : function ( button )
    {
        if ( button.isPressed )
            this.context.fillStyle = button.selectedColor;
        else if ( button.isDisabled )
            this.context.fillStyle = button.disabledColor;
        else    
            this.context.fillStyle = button.color;

        if ( this.InvertYEnabled() )
        {
            if ( button.image != null )
                this.context.drawImage( button.image, (button.x - button.w/2) * scaleUp, (this.Height() - ( button.y + button.h/2 )) * scaleUp , button.w * scaleUp, button.h * scaleUp);
            else
                this.context.fillRect((button.x - button.w/2) * scaleUp, (this.Height() - ( button.y + button.h/2 )) * scaleUp , button.w * scaleUp, button.h * scaleUp);
        }
        else
            this.context.fillRect(button.x - button.w/2, button.y + button.h/2, button.w, button.h);

        this.context.fillStyle = button.fontColor;
        this.context.font = button.fontType;

        if ( this.InvertYEnabled() )
        {
            this.context.fillText( button.text, button.x * scaleUp, (this.Height() - (button.y - button.fontHeightInPX/2)) * scaleUp );
        }
        else
            this.context.fillText( button.text, button.x, (button.y - button.fontHeightInPX/2));

        this.context.textAlign="center"; 
    },
    Width : function () { return MyApplicationInstance.GameWidth(); },
    Height : function () { return MyApplicationInstance.GameHeight(); },

    InvertYEnabled : function () { return true; }
}




// ****************************
// Sudoku UI

function SudokuUI ()
{
    this.BGui = new UI();
    this.ui = new UI();
    this.callback = null;

    this.OnClicked  = function ( r, c  )
    {
        //alert ( r + " " + c  );
        this.callback ( r, c );

    }

    this.GetButtonFor  = function ( r, c )
    {
        return this.ui.buttons[ ConvertRowColToIndex ( r, c ) ];
    }
    this.SetValueFor = function ( r, c, number, isSetBySolver )
    {
        if ( number <= 0 )
            number = " ";
        //alert ( r + " " +  c + " " + this.ui.buttons.length);
        let button = this.GetButtonFor ( r, c );
        button.SetText ( number );
        if ( isSetBySolver )
            button.SetFontColor ( "#420DAB");
        else 
            button.SetFontColor ( "#000000");
    }

    this.Initialize = function ( callback )
    {
        this.callback = callback;
        this.BGui.Init( true );

        let image = this.BGui.CreateButton ();
        image.Init ( 0, 
                        0, 
                        0, 
                        0,
                        (25 * scaleUp) + "px Verdana", "",
                        "#ffffff", 15,
                        "#ffffff", "#ffffff", "#ffffff",  // alpha
                        null,
                        true );
        image.SetImage ( document.getElementById("sudokuImage"));



        this.ui.Init ( true );

        let button = null;
        
        let width = 50;
        let height = 50;
        let paddingWidth = 4;
        let paddingHeight = 4;
        let currentX = 0;
        let currentY = 0;
        let centerX = MyApplicationInstance.GameWidth()/2;
        let centerY = MyApplicationInstance.GameHeight()/2;
        //let centerY = 350;
        let startX = ( centerX ) - ( MAX_ROWS_COLS * width + (MAX_ROWS_COLS+1) * paddingWidth ) / 2;
        let startY = ( centerY ) + ( MAX_ROWS_COLS * height + (MAX_ROWS_COLS+1) * paddingHeight ) / 2 ;
    
        image.SetPosition ( centerX, centerY );
        image.SetDimention ( MAX_ROWS_COLS * width + (MAX_ROWS_COLS+1) * paddingWidth, 
                                MAX_ROWS_COLS * height + (MAX_ROWS_COLS+1) * paddingHeight);

        

        currentY = startY - ( paddingHeight + height / 2 ) ;

        // these buttons are directly going intto this.ui.buttons. so we can access from there
        // we dontt need to cache them here.
        for ( let r = 0; r < MAX_ROWS_COLS; r ++  )
        {
            currentX = startX + paddingWidth + width / 2;

            for ( let c = 0; c < MAX_ROWS_COLS; c ++ )
            {
                button = this.ui.CreateButton ();
                button.Init ( currentX, 
                                currentY, 
                                width, height,

                                (25 * scaleUp) + "px Verdana", " ",
                                "#222222", 15,

                                "#dddddd00", "#aaaaaa00", "#aaaaaaff", 

                                function ( button ) 
                                {
                                    this.OnClicked ( ConvertIndexToRow ( button.userData ), ConvertIndexToCol ( button.userData ) );   
                                }.bind ( this ),

                                true );
                button.SetUserData ( ConvertRowColToIndex ( r, c ) );
                currentX += width + paddingWidth;
            }
            currentY -= (height + paddingHeight);
        }
    }

    this.Update = function ()
    {
    }
    this.Render = function () 
    {
        this.BGui.Render();
        this.ui.Render();
    }
    this.OnMouseDown = function( x, y )
    {
        this.ui.OnMouseDown ( x, y );
    }
    this.OnMouseUp = function( x, y )
    {
        this.ui.OnMouseUp ( x, y );
    }
}

// ****************************
// Select Number UI

function SelectNumberUI ()
{
    this.callback = null;
    this.ui = new UI();

    this.OnClicked  = function ( number )
    {
        this.callback ( number );
        //alert ( number );
    }

    this.Initialize = function ( callback )
    {
        this.callback = callback;
        this.ui.Init ( true );

        let button = null;

        // background - non clickable
        button = this.ui.CreateButton ();
        button.Init ( MyApplicationInstance.GameWidth()/2, 
                        MyApplicationInstance.GameHeight()/2, 
                        MyApplicationInstance.GameWidth(), 
                        MyApplicationInstance.GameHeight(),
                        (25 * scaleUp) + "px Verdana", "",
                        "#222222", 15,
                        "#444444aa", "#444444aa", "#444444aa",  // alpha
                        null,
                        true );
        
        let width = 45;
        let height = 45;
        let paddingWidth = 8;
        let paddingHeight = 8;
        let currentX = 0;
        let currentY = 0;
        let startX = ( MyApplicationInstance.GameWidth()/2 ) - ( 3 * width + (3+1) * paddingWidth ) / 2;
        let startY = MyApplicationInstance.GameHeight() / 2 + ( 4 * height + (4+1) * paddingHeight ) / 2;

        currentY = startY;
        
        {
            currentX = startX;
            currentX += paddingWidth + width/2;
            currentY -= paddingHeight + height/2;

            button = this.GetButton ( currentX, currentY, width, height, 1); currentX += paddingWidth + width;
            button = this.GetButton ( currentX, currentY, width, height, 2); currentX += paddingWidth + width;
            button = this.GetButton ( currentX, currentY, width, height, 3); currentX += paddingWidth + width;
        }
        {
            currentX = startX;
            currentX += paddingWidth + width/2;
            currentY -= paddingHeight + height;

            button = this.GetButton ( currentX, currentY, width, height, 4); currentX += paddingWidth + width;
            button = this.GetButton ( currentX, currentY, width, height, 5); currentX += paddingWidth + width;
            button = this.GetButton ( currentX, currentY, width, height, 6); currentX += paddingWidth + width;
        }
        {
            currentX = startX;
            currentX += paddingWidth + width/2;
            currentY -= paddingHeight + height;

            button = this.GetButton ( currentX, currentY, width, height, 7); currentX += paddingWidth + width;
            button = this.GetButton ( currentX, currentY, width, height, 8); currentX += paddingWidth + width;
            button = this.GetButton ( currentX, currentY, width, height, 9); currentX += paddingWidth + width;
        }

        {
            currentX = startX;
            currentX += paddingWidth + width/2;
            currentY -= paddingHeight + height;

            /*button = this.GetButton ( currentX, currentY, width, height, 7); */currentX += paddingWidth + width;
            button = this.GetButton ( currentX, currentY, width, height, " "); currentX += paddingWidth + width;
            //button = this.GetButton ( currentX, currentY, width, height, 9); currentX += paddingWidth + width;
        }
    }

    this.Show = function ( validNumbers )
    {
        this.ui.SetVisibility (true );
    }
    this.Hide = function ()
    {
        this.ui.SetVisibility (false );
    }

    this.GetButton = function ( x, y, w, h, text )
    {
        let button = this.ui.CreateButton ();
        button.Init ( x, 
                        y, 
                        w, h,

                        (25 * scaleUp) + "px Verdana", text,
                        "#222222", 15,

                        "#dddddd", "#aaaaaa", "#aaaaaa", 

                        function ( button ) 
                        {
                            this.OnClicked ( button.userData );   
                        }.bind ( this ),

                        true );
        button.SetUserData ( text );
        return button;
    }

    this.Update = function ()
    {
    }
    this.Render = function () 
    {
        this.ui.Render();
    }
    this.OnMouseDown = function( x, y )
    {
        this.ui.OnMouseDown ( x, y );
    }
    this.OnMouseUp = function( x, y )
    {
        this.ui.OnMouseUp ( x, y );
    }
}



// ****************************
// Application Touch and key board

function checkDown(e) 
{

    touchVar = e || window.event;
    //console.log("here1");
}

function checkUp(e)
{
    touchVar = undefined;
    //console.log("here2");
}

function OnKeyPress ( e) 
{
    if ( e == null || e == undefined )
        return;

    MyApplicationInstance.StateManager.OnKeyPress ( e.keyCode );
}

function OnMouseDown(evt) 
{
    var mousePos = GetMousePosFromCanvas( renderer.canvas, evt);

    if ( renderer.InvertYEnabled() )
    {
        mousePos.y = renderer.Height() - mousePos.y;
    }

    if ( MyApplicationInstance.StateManager != null )
        MyApplicationInstance.StateManager.OnMouseDown ( mousePos.x, mousePos.y );

    //console.log('OnMouseDown ' + mousePos.x + " " + mousePos.y );
}
function OnMouseUp(evt) 
{
    var mousePos = GetMousePosFromCanvas( renderer.canvas, evt);

    if ( renderer.InvertYEnabled() )
    {
        mousePos.y = renderer.Height() - mousePos.y;
    }

    if ( MyApplicationInstance.StateManager != null )
        MyApplicationInstance.StateManager.OnMouseUp ( mousePos.x, mousePos.y );

    //console.log('OnMouseUp ' + mousePos.x + " " + mousePos.y );
}

function GetMousePosFromCanvas(canvas, event) 
{
    var rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left)/scaleUp,
        y: (event.clientY - rect.top)/scaleUp
    };
}


// Utility for ingame


function ConvertRowColToIndex ( r, c )
{
    return r * MAX_ROWS_COLS + c ;
}
function ConvertIndexToRow ( index )
{
    return Math.floor( index / MAX_ROWS_COLS );
}
function ConvertIndexToCol ( index )
{
    return index % MAX_ROWS_COLS;
}

