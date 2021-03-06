
// Main Menu 

function StartMenuState ()
{
    this.Start = function() 
    {
        this.ui = new UI();
        this.ui.Init ( true );

        this.newPuzzleButton = this.ui.CreateButton ();
        this.newPuzzleButton.Init ( MyApplicationInstance.GameWidth()/2, 
                                400, 
                                200, 50,

                                (20 * scaleUp) + "px Verdana", "NEW PUZZLE",
                                "white", 20,

                                "green", "red", "purple", 

                                function() 
                                { 
                                    //alert("On Start clicked"); 
                                    MyApplicationInstance.StateManager.PushState ( new SelectDifficultyState() );
                                },

                                true );

        this.instructionsTxt = this.ui.CreateText ();
        this.instructionsTxt.Init ( MyApplicationInstance.GameWidth()/2, 
                                    360,
                                    400, 100,

                                (15 * scaleUp) + "px Verdana", "Solve it by yourself !",
                                "purple", 15,

                                true );

        this.getSolutionButton = this.ui.CreateButton ();
        this.getSolutionButton.Init ( MyApplicationInstance.GameWidth()/2, 
                                200, 
                                200, 50,

                                (20 * scaleUp) + "px Verdana", "GET SOLUTION",
                                "white", 20,

                                "green", "red", "purple", 

                                function() 
                                { 
                                    //alert("On Start clicked"); 
                                    MyApplicationInstance.StateManager.PushState ( new SolverState() );
                                },

                                true );
        this.instructionsTxt2 = this.ui.CreateText ();
        this.instructionsTxt2.Init ( MyApplicationInstance.GameWidth()/2, 
                                    160,
                                    400, 100,

                                (15 * scaleUp) + "px Verdana", "Get help if you are stuck !",
                                "purple", 15,

                                true );
    }
    this.End = function () 
    {
        
    }
    this.Update = function ( dt )
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
    this.OnKeyPress = function ( keyCode )
    {
    }

    this.ui = null;
    this.newPuzzleButton = null;
    this.getSolutionButton = null;
}

function SelectDifficultyState ()
{
    this.Start = function() 
    {
        this.ui = new UI();
        this.ui.Init ( true );

        let difficulty = null;
        
        difficulty = this.ui.CreateButton ();
        difficulty.Init ( MyApplicationInstance.GameWidth()/2, 
                                400, 
                                200, 50,

                                (20 * scaleUp) + "px Verdana", "Easy",
                                "white", 20,

                                "green", "red", "purple", 

                                function() 
                                { 
                                    alert("NYI");
                                    //alert("On Start clicked"); 
                                    // MyApplicationInstance.StateManager.PushState ( new InGameState() );
                                },

                                true );

    difficulty = this.ui.CreateButton ();
    difficulty.Init ( MyApplicationInstance.GameWidth()/2, 
                                300, 
                                200, 50,

                                (20 * scaleUp) + "px Verdana", "Medium",
                                "white", 20,

                                "green", "red", "purple", 

                                function() 
                                { 
                                    alert("NYI");
                                    //alert("On Start clicked"); 
                                    // MyApplicationInstance.StateManager.PushState ( new InGameState() );
                                },

                                true );

    difficulty = this.ui.CreateButton ();
    difficulty.Init ( MyApplicationInstance.GameWidth()/2, 
                                200, 
                                200, 50,

                                (20 * scaleUp) + "px Verdana", "Hard",
                                "white", 20,

                                "green", "red", "purple", 

                                function() 
                                { 
                                    alert("NYI");
                                    //alert("On Start clicked"); 
                                    // MyApplicationInstance.StateManager.PushState ( new InGameState() );
                                },

                                true );
    }
    this.End = function () 
    {
        
    }
    this.Update = function ( dt )
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
    this.OnKeyPress = function ( keyCode )
    {
    }

    this.ui = null;
}






// In - Game 
function SolverState ()
{
    this.ui = null;
    this.sudokuUI = null;
    this.numberSelectionUI = null;
    this.nestedSolver = null;

    this.Start = function() 
    {
        this.sudokuUI = new SudokuUI();
        this.sudokuUI.Initialize( function (r,c ) { this.OnSudukoBoardBlockSelected(r,c);}.bind(this)  );

        this.numberSelectionUI = new SelectNumberUI();
        this.numberSelectionUI.Initialize( function ( number ) { this.OnNumberSelected( number );}.bind(this) );
        this.numberSelectionUI.ui.SetVisibility ( false );

        this.ui = new UI();
        this.ui.Init ( true );

        this.statusMessageTxt = this.ui.CreateText ();

        this.statusMessageTxt.Init ( MyApplicationInstance.GameWidth()/2, 
                                 30, 
                                150, 30,

                                (15 * scaleUp) + "px Verdana", "",
                                "grey", 15,
                                true );

        this.solveButton = this.ui.CreateButton ();

        this.solveButton.Init ( MyApplicationInstance.GameWidth() - 100, 
                                MyApplicationInstance.GameHeight() - 25, 
                                150, 30,

                                (15 * scaleUp) + "px Verdana", "SOLVE",
                                "white", 15,

                                "green", "grey", "purple", 

                                function() 
                                { 
                                    this.Solve ();
                                    //alert("On Start clicked"); 
                                    //MyApplicationInstance.StateManager.PushState ( new SelectDifficultyState() );
                                }.bind(this),

                                true );

        let backButton = this.ui.CreateButton ();
        backButton.Init ( 100, 
                                MyApplicationInstance.GameHeight() - 25, 
                                150, 30,

                                (15 * scaleUp) + "px Verdana", "BACK",
                                "white", 15,

                                "green", "grey", "purple", 

                                function() 
                                { 
                                    MyApplicationInstance.StateManager.PopState();
                                    //alert("On Start clicked"); 
                                    //MyApplicationInstance.StateManager.PushState ( new SelectDifficultyState() );
                                }.bind(this),

                                true );

        if ( this.initialValues != null )
        {
            for ( i = 0; i < MAX_ROWS_COLS * MAX_ROWS_COLS; i++ )
            {
                this.sudokuUI.SetValueFor ( ConvertIndexToRow ( i ), ConvertIndexToCol ( i ), this.initialValues[i], false);
            }   
        }
    }
    this.End = function () 
    {

    }

    this.Update = function ( dt )
    {
        if ( this.nestedSolver != null )
			this.nestedSolver.Update();

        // if ( this.nestedSolver != null )
        // {
        //     if ( this.nestedSolver.IsSolvingCompleted () )
        //     {
        //         if ( this.solver.IsSolvedFully())
        //             this.solveButton.SetText ("Solved");
        //         else 
        //             this.solveButton.SetText("Partially solved");

        //         for ( r = 0; r < MAX_ROWS_COLS; r ++ )
        //         {
        //             for ( c = 0; c < MAX_ROWS_COLS; c++ )
        //             {
        //                 this.sudokuUI.SetValueFor ( r, c, this.solver.boxes[r][c].value );
        //             }
        //         }
        //         this.solver = null;
        //         return;
        //     }
        //     this.solver.UpdateSolve();
        // }
    }

    this.Render = function () 
    {
       
        this.sudokuUI.Render();
        this.numberSelectionUI.Render();
        this.ui.Render();
    }

    this.OnSudukoBoardBlockSelected = function ( r, c )
    {
        if ( !this.AreChangesAccepted() )
            return;

        this.selectedR = r;
        this.selectedC = c;
        this.numberSelectionUI.Show( null );
        //alert ( r );
    }.bind(this)
    this.OnNumberSelected = function ( number )
    {
        if ( !this.AreChangesAccepted() )
            alert ( "Changes are disabled. Then how are we here!");
        this.numberSelectionUI.Hide ( );
        this.sudokuUI.SetValueFor ( this.selectedR, this.selectedC, number, false );
        //alert ( r );
    }.bind(this)
    this.AreChangesAccepted = function () 
    {
        return !this.solveButton.IsDisabled();
    }
    this.Solve = function ()
    {
        this.solveButton.SetDisabled ( true );
        this.statusMessageTxt.SetText ("working on a solution ...");

        let values = [];
        for ( let r = 0; r < MAX_ROWS_COLS; r++ )
        {
            values.push( [] );
            for ( let c = 0; c < MAX_ROWS_COLS; c++ )
            {
                let val = this.sudokuUI.GetButtonFor ( r, c ).text;
                if ( typeof val == "number")
                    values[r].push  ( val );
                else 
                    values[r].push  ( -1 );
            }
        }
        let solver = new Solver ();
        solver.Init ( values );

        this.nestedSolver = new NestedSolver();
        this.nestedSolver.Init1 ( solver, 1 );
        this.nestedSolver.Solve( this.OnSolveCompleted, this.OnSolveFailed );
    }

    this.PutResultOnBoard = function ()
    {
        if ( this.nestedSolver.solver != null )
        {
            //
            {
                for ( r = 0; r < MAX_ROWS_COLS; r ++ )
                {
                    for ( c = 0; c < MAX_ROWS_COLS; c++ )
                    {
                        if ( this.nestedSolver.solver.boxes[r][c].isSetBySolver )
                            this.sudokuUI.SetValueFor ( r, c, this.nestedSolver.solver.boxes[r][c].value, true );
                    }
                }
            }
        }
    }

    this.PutStatusOnBoard = function () 
    {
        this.statusMessageTxt.SetText( this.statusMessage );
    }
    this.OnSolveCompleted = function ()
    {
        this.statusMessage = "Solved";
        //alert( "completed" );

        this.PutResultOnBoard();
        this.PutStatusOnBoard();

        this.nestedSolver = null;

        this.solveButton.SetDisabled ( false );

    }.bind( this )

    this.OnSolveFailed = function ( message ) 
    {
        this.statusMessage = message;
        console.log("failed..");
        //alert ( "failed ");
        //this.PutResultOnBoard();
        this.PutStatusOnBoard();
        this.nestedSolver = null;

        this.solveButton.SetDisabled ( false );
        
    }.bind ( this )

    this.OnMouseDown = function( x, y )
    {
        if ( this.nestedSolver != null )
            return;

        if ( this.numberSelectionUI.ui.isVisible )
        {
            
            this.numberSelectionUI.OnMouseDown ( x, y );
            return;
        }
        
        this.sudokuUI.OnMouseDown ( x, y );
        this.ui.OnMouseDown ( x, y );
    }
    this.OnMouseUp = function( x, y )
    {
        if ( this.nestedSolver != null )
            return;

        if ( this.numberSelectionUI.ui.isVisible )
        {
            
            this.numberSelectionUI.OnMouseUp ( x, y );
            return;
        }

        this.sudokuUI.OnMouseUp ( x, y );
        this.ui.OnMouseUp ( x, y );
    }
    
    this.OnKeyPress = function ( keyCode )
    {
        // space
        if (keyCode == '32') 
        {
        }
        else if (keyCode == '38') 
        {
            // up arrow
        }
        else if (keyCode == '40') {
            // down arrow
        }
        else if (keyCode == '37') {
           // left arrow
        }
        else if (keyCode == '39') {
           // right arrow
        }
    }

    this.statusMessage = "";
    this.selectedR = -1;
    this.selectedC = -1;
    this.solveButton = null;
    this.statusMessageTxt = null;


    this.initialValues = 

            null;
                
            ////Easy
			// [
			// 	1,0,0,0,6,3,0,0,9,
			// 	9,0,0,4,2,0,7,0,0,
			// 	0,4,7,1,0,0,3,8,0,

			// 	0,5,6,0,0,0,0,0,0,
			// 	0,2,0,0,0,0,0,9,0,
			// 	0,0,0,0,0,0,6,7,0,

			// 	0,3,4,0,0,9,2,1,0,
			// 	0,0,1,0,3,6,0,0,7,
			// 	5,0,0,8,1,0,0,0,3 
            // ];


			
			// [
			// 	1,0,0,0,6,3,0,0,9,
			// 	9,0,0,4,2,0,7,0,0,
			// 	0,4,7,1,0,0,3,8,0,

			// 	0,5,6,0,0,0,0,0,0,
			// 	0,2,0,0,0,0,0,9,0,
			// 	0,0,0,0,0,0,6,7,0,

			// 	0,3,4,0,0,9,0,0,0,
			// 	0,0,1,0,3,6,0,0,0,
			// 	5,0,0,8,1,0,0,0,0 
            // ];

			//moderate difficulty
			
			// [
			// 	0,6,2,0,9,0,0,0,0,
			// 	0,0,1,0,0,0,0,0,0,
			// 	0,4,9,0,0,1,0,0,0,
			
			// 	7,0,3,0,0,9,0,0,1,
			// 	0,0,8,6,2,3,7,0,0,
			// 	4,0,0,1,0,0,2,0,8,
			
			// 	0,0,0,2,0,0,5,7,0,
			// 	0,0,0,0,0,0,1,0,0,
			// 	0,0,0,0,5,0,8,2,0,
            // ];


			// very hard 
			
			// [
			// 	0,0,0,0,0,7,0,1,6,
			// 	0,0,0,0,6,0,7,9,3,
			// 	0,0,0,0,0,0,0,0,0,

			// 	0,0,0,0,0,0,0,0,0,
			// 	9,0,0,6,0,1,0,5,0,
			// 	0,0,3,0,0,0,8,2,1,

			// 	0,0,4,0,8,6,0,0,0,
			// 	0,1,5,9,2,0,0,0,0,
			// 	0,0,9,0,4,0,0,0,0,
            // ];

            // Impossible
            // [
			// 	0,0,0,0,0,0,0,0,1,
			// 	0,0,0,0,0,0,0,0,0,
			// 	0,0,0,0,0,0,0,0,0,

			// 	0,0,0,0,0,0,0,0,0,
			// 	0,0,0,0,0,0,0,2,0,
			// 	0,0,0,0,0,0,0,0,0,

			// 	0,0,0,0,0,0,0,0,0,
			// 	0,0,0,0,0,0,0,0,0,
			// 	0,0,0,0,0,0,3,0,0,
            // ];

            // just wrong values
            // [
			// 	0,0,0,0,0,7,0,1,6,
			// 	0,0,0,0,6,0,7,9,3,
			// 	0,0,0,0,0,0,0,0,0,

			// 	0,0,0,0,0,0,0,0,0,
			// 	9,0,0,6,0,1,0,5,0,
			// 	0,0,3,0,0,0,8,2,1,

			// 	0,0,4,0,8,6,0,0,0,
			// 	1,1,5,9,2,0,0,0,0,
			// 	0,0,9,0,4,0,0,0,0,
            // ];
}