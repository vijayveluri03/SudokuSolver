

function Box ()
{
    this.row = 0;
    this.col = 0;
    this.index = 0;
    this.quadrant = 0;
    this.value = 0;
    this.otherBoxesInSameRow = [];
    this.otherBoxesInSameCol = [];
    this.otherBoxesInSameQuad = [];
    this.possibleSolutions = [];

    this.getBoxWithIndexDelegate = null;



	this.Init = function ( r, c, index, quadrant, delegateToFetchOtherBoxes )
	{
		this.row = r;
		this.col = c;
		this.index = index;
		this.quadrant = quadrant;

		this.getBoxWithIndexDelegate = delegateToFetchOtherBoxes;

		for ( i = 1; i <= MAX_ROWS_COLS; i++ ) 
			this.possibleSolutions.push ( i );
	}

	this.InitForClone = function ( delegateToFetchOtherBoxes ) 
	{
		this.getBoxWithIndexDelegate = delegateToFetchOtherBoxes;
	}

	this.Clone  = function () 
	{
        box = new Box();
        box.row = this.row;
        box.col = this.col;
        box.quadrant = this.quadrant;
        box.index = this.index;
        box.value = this.value;

        box.getBoxWithIndexDelegate = null;

        box.otherBoxesInSameRow = this.otherBoxesInSameRow.slice ( 0 );
		box.otherBoxesInSameCol = this.otherBoxesInSameCol.slice ( 0 );
		box.otherBoxesInSameQuad = this.otherBoxesInSameQuad.slice ( 0 );
        box.possibleSolutions = this.possibleSolutions.slice ( 0 );
        
        return box;
	}

	this.SetValue = function ( value ) 
	{
		if ( this.IsThisBoxFilled() ) 
			alert("Something went wrong");

		if ( value <= 0 || value > MAX_ROWS_COLS ) 
			alert ("something went wrong");
		
	
		this.RemoveAllPossibilities();	// since there is a value attached to this box now.
		this.value = value;

		this.RemovePossibilitiesForOthers ( this.value );
	}

	this.RemoveAllPossibilities = function ( )
	{
		if ( this.IsThisBoxFilled () )
			return;
        this.possibleSolutions = [];
	}

	this.RemovePossibility = function ( value ) 
	{
		if ( this.IsThisBoxFilled () )
            return;
        RemoveFromArray( this.possibleSolutions, value );
	}

	this.IsThisBoxFilled = function () 
	{
		return this.value > 0;
	}


	this.AddSiblingRowBox = function ( box ) 
	{
		if ( box == this ) 
			return;
		if ( DoesArrayContains ( this.otherBoxesInSameRow, box.index ) ) 
            return;
            
        this.otherBoxesInSameRow.push ( box.index );
	}

	this.AddSiblingColBox = function ( box ) 
	{
		if ( box == this ) 
			return;
		if ( DoesArrayContains( this.otherBoxesInSameCol, box.index ) ) 
			return;
        this.otherBoxesInSameCol.push ( box.index );
	}

	this.AddSiblingQuadBox = function ( box ) 
	{
		if ( box == this ) 
			return;
        if ( DoesArrayContains( this.otherBoxesInSameQuad, box.index ) ) 
			return;
        this.otherBoxesInSameQuad.push ( box.index );
	}




	this.RemovePossibilitiesForOthers  = function ( value )
	{
		for ( i = 0; i < this.otherBoxesInSameRow.length; i++ ) 
		{
			this.getBoxWithIndexDelegate( this.otherBoxesInSameRow[i] ).RemovePossibility ( value );
		}

		for ( i = 0; i < this.otherBoxesInSameCol.length; i++ ) 
		{
			this.getBoxWithIndexDelegate( this.otherBoxesInSameCol[i] ).RemovePossibility ( value );
		}

		for ( i = 0; i < this.otherBoxesInSameQuad.length; i++ ) 
		{
			this.getBoxWithIndexDelegate ( this.otherBoxesInSameQuad[i] ).RemovePossibility ( value );
		}
	}

	this.otherBoxesInSameRow = [];
	this.otherBoxesInSameCol = [];
	this.otherBoxesInSameQuad = [];
	this.possibleSolutions = [];
	this.getBoxWithIndexDelegate = null;
}


function Solver ()
{

	// public members 

	this.Init = function ( data )
	{
		console.log("Data recieved in solver");
		this.InitializeData();

		{
			for ( let r = 0; r < MAX_ROWS_COLS; r ++ ) 
			{
				for ( let c = 0; c < MAX_ROWS_COLS; c++ )
				{
					if ( data[r][c] > 0 )
					{
						this.boxes[r][c].SetValue ( data[r][c] );
						//PrintPotential();
					}
				}
			}
		}
	}

	this.InitClone = function ()
	{
		this.runSolver = false;
		this.isSolvingCompleted = false;
	}

	this.SetValue = function ( r, c, value ) 
	{
		//QDebug.Assert ( !boxes[r][c].IsThisBoxFilled() );
		this.boxes[r][c].SetValue(value);
	}

	this.GetPossibleSolutions = function ( r, c ) 
	{
		return this.boxes[r][c].possibleSolutions;
	}

	this.Solve = function (  )
	{
		this.runSolver = true;
	}

	this.IsSolvingCompleted = function () 
	{
		return this.isSolvingCompleted;
	}

	this.IsThereAnError = function ()
	{
		for ( let r = 0; r < MAX_ROWS_COLS; r ++ ) 
		{
			for ( let c = 0; c < MAX_ROWS_COLS; c++ )
			{
				let box = this.boxes[r][c];
				if ( box.IsThisBoxFilled() )
				{
					for (  i = 0; i < box.otherBoxesInSameQuad.length; i++ ) 
					{
						if ( box.value == this.GetBoxOfIndex ( box.otherBoxesInSameQuad[i]).value ) 
							return true;
					}
					for (  i = 0; i < box.otherBoxesInSameCol.length; i++ ) 
					{
						if ( box.value == this.GetBoxOfIndex( box.otherBoxesInSameCol[i] ).value ) 
							return true;
					}
					for (  i = 0; i < box.otherBoxesInSameRow.length; i++ ) 
					{
						if ( box.value == this.GetBoxOfIndex( box.otherBoxesInSameRow[i] ).value ) 
							return true;
					}
				}
				else 
				{
					if ( box.possibleSolutions.length == 0 )
						return true;
				}
			}
		}
		return false;
	}

	this.IsSolvedFully = function ()
	{
		for (  r = 0; r < MAX_ROWS_COLS; r ++ ) 
		{
			for (  c = 0; c < MAX_ROWS_COLS; c++ )
			{
				if ( !this.boxes[r][c].IsThisBoxFilled() )
				{
					return false;
				}
			}
		}
		return true;
	}

	this.UpdateSolve = function () 
	{
		if ( this.runSolver ) 
		{
			let found = false;
			for ( r = 0; r < MAX_ROWS_COLS; r ++ ) 
			{
				for ( c = 0; c < MAX_ROWS_COLS; c++ )
				{
					if ( this.boxes[r][c].possibleSolutions.length == 1 && !this.boxes[r][c].IsThisBoxFilled() )
					{
						found = true;
						this.boxes[r][c].SetValue ( this.boxes[r][c].possibleSolutions[0] );
					}
				}
			}

//			Print("After a Pass values");
//			PrintPotential("After a pass potential");

			if ( !found ) 
			{
				this.runSolver = false;
				this.isSolvingCompleted = true;
			}
		}
	}

	this.Print = function( title ) 
	{
		strb = ""


		strb += ( title + ":\n" );
		for ( r = 0; r < MAX_ROWS_COLS; r++ ) 
		{
			for ( c = 0; c < MAX_ROWS_COLS; c++ ) 
			{
				strb += (this.boxes[r][c].value > 0 ? this.boxes[r][c].value : "_" );
//				if ( c < (MAX_ROWS_COLS - 1 ) )
//					strb.Append(",");
			}
			strb += ( "\n" );
		}

		console.log(strb );
	}

	this.PrintPotential = function( title ) 
	{
		strb = "";

		strb += ( title +"\n" );
		for ( r = 0; r < MAX_ROWS_COLS; r++ ) 
		{
			for ( c = 0; c < MAX_ROWS_COLS; c++ ) 
			{
				strb += (  this.boxes[r][c].possibleSolutions.length );
//				if ( c < (MAX_ROWS_COLS - 1 ) )
//					strb.Append(",");
			}
			strb += ( "\n" );
		}

		console.log(strb );
	}


	this.Clone = function () 
	{
		other = new Solver();

		other.boxes = [];
		other.boxesArray = [];

		for ( r = 0; r < MAX_ROWS_COLS; r ++ ) 
		{
			other.boxes.push ( [] );
			for ( c = 0; c < MAX_ROWS_COLS; c++ )
			{
				other.boxes[r].push ( new Box() );
				other.boxesArray.push ( null );

				index = r * MAX_ROWS_COLS + c;

				let clonedBox = this.boxes[r][c].Clone();
				clonedBox.InitForClone ( other.GetBoxOfIndex );

				other.boxes[r][c] = clonedBox;
				other.boxesArray[ index ] = clonedBox;
			}
		}
		other.runSolver = this.runSolver;
		other.isSolvingCompleted = this.isSolvingCompleted;

		return other;
	}

	// Private members

	// this is a stupid method , we should write better logic
	this.InitializeData = function ( )
	{
		this.boxes = []
		this.boxesArray = []
        for (  r = 0; r < MAX_ROWS_COLS; r ++ ) 
		{
            this.boxes.push ( [] );
			for (  c = 0; c < MAX_ROWS_COLS; c++ )
			{
				this.boxes[r].push ( new Box() );
				this.boxesArray.push ( null );
            }
        }
		for (  r = 0; r < MAX_ROWS_COLS; r ++ ) 
		{
			for (  c = 0; c < MAX_ROWS_COLS; c++ )
			{
				let index = r * MAX_ROWS_COLS + c;

				let quad = this.GetQuadrant ( r, c );

				this.boxesArray [ index ] = this.boxes[r][c];

				//console.log(r.ToString() + "," + c.ToString() + "->" + quad.ToString());
				this.boxes[r][c].Init ( r, c,index, quad, this.GetBoxOfIndex );
			}
		}

		for (  r = 0; r < MAX_ROWS_COLS; r ++ ) 
		{
			for (  c = 0; c < MAX_ROWS_COLS; c++ )
			{
				let box = this.boxes[r][c];

				for (  rOther = 0; rOther < MAX_ROWS_COLS; rOther ++ ) 
				{
					for (  cOther = 0; cOther < MAX_ROWS_COLS; cOther++ )
					{
						let boxOther = this.boxes[rOther][cOther];

						if ( box.row == boxOther.row ) 
							box.AddSiblingRowBox ( boxOther );

						if ( box.col == boxOther.col ) 
							box.AddSiblingColBox ( boxOther );

						if ( box.quadrant == boxOther.quadrant ) 
							box.AddSiblingQuadBox ( boxOther );
					}
				}

				if ( box.otherBoxesInSameRow.length != ( MAX_ROWS_COLS - 1 ) ) 
					alert("Something went wrong");

				if ( box.otherBoxesInSameCol.length != ( MAX_ROWS_COLS - 1 ) ) 
					alert("Something went wrong");

				if ( box.otherBoxesInSameQuad.length != ( MAX_ROWS_COLS - 1 ) ) 
					alert("Something went wrong");
			}
		}
	}

	this.GetQuadrant = function ( r, c ) 
	{
		if ( r >= 0 && r < 3 )
		{
			if ( c >= 0 && c < 3 )
			{
				return 1;
			}
			else if ( c >=3 && c < 6 ) 
			{
				return 2;
			}
			else if ( c >=6 && c < 9 ) 
			{
				return 3;
			}
			else 
				alert("Something went wrong");
		}
		else if ( r >=3 && r < 6 ) 
		{
			if ( c >= 0 && c < 3 )
			{
				return 4;
			}
			else if ( c >=3 && c < 6 ) 
			{
				return 5;
			}
			else if ( c >=6 && c < 9 ) 
			{
				return 6;
			}
			else 
				alert("Something went wrong");
		}
		else if ( r >=6 && r < 9 ) 
		{
			if ( c >= 0 && c < 3 )
			{
				return 7;
			}
			else if ( c >=3 && c < 6 ) 
			{
				return 8;
			}
			else if ( c >=6 && c < 9 ) 
			{
				return 9;
			}
			else 
				alert("Something went wrong");
		}
		else 
			alert("Something went wrong");
		return -1;

	}


	this.GetBoxOfIndex = function( index ) 
	{
		return this.boxesArray[index];
	}.bind ( this )

	this.boxes = null; // 2d array
	this.boxesArray = null;
	this.runSolver = false;
	this.isSolvingCompleted = false;

}

var eDeepSearch = {	"EASY": 1,	"MEDIUM":2, "HARD":3 };

function NestedSolver ()
{
	this.nestedLevelID = 0;
	this.solver = null;


	this.Init1 = function ( initialSolver, nestedLevelId )
	{
		this.solver = initialSolver;
		this.nestedLevelID = nestedLevelId;
		console.log("in Init this.nestedLevelID:" + this.nestedLevelID);
	}
	this.Init2  = function( initialSolver, r, c, value, nestedLevelId) 
	{
		this.solver = initialSolver;
		this.solver.SetValue ( r, c, value );
		this.nestedLevelID = nestedLevelId;
		console.log("in Init this.nestedLevelID:" + this.nestedLevelID);
	}

	this.Solve  = function( onCompletedCallback, OnFailed ) 
	{
		this.onCompletedCallback = onCompletedCallback;
		this.OnFailedCallback = OnFailed;

		this.runSolver = true;
		this.solver.Solve();
	}

	this.Update  = function()
	{
		if ( this.runSolver )
		{
			if ( !this.solver.IsSolvingCompleted() )
			{
				this.solver.UpdateSolve();
				if ( this.solver.IsThereAnError() )
				{
					this.runSolver = false;
					console.log("Error occured. reverting from " + this.nestedLevelID);
					this.OnFailedCallback();
				}
			}
			else if ( this.solver.IsSolvedFully() )
			{
				this.runSolver = false;
				this.onCompletedCallback();
				
			}
			else
			{
				// its not solved fully 
				// but solver is done 

				if ( this.solutions == null ) 
				{
					this.CreateSolutions();
				}

				if ( this.childSolver == null ) 
				{
					if ( this.currentIndex >= this.solutions.length ) 
					{
						if ( this.nestedLevelID == this.BASE_ID && this.deepSearchLevel < eDeepSearch.HARD )
						{
							this.deepSearchLevel++;
							console.log("DEEP SEARCH Level Increased to Level :" + this.deepSearchLevel);

							this.currentIndex = 0;
							this.solutions = null;
							return;
						}

						console.log("All iterations completed. reverting from " + this.nestedLevelID + 
								"  this.BASE_ID:" + this.BASE_ID + " deepSearchLevel: " + 
									this.deepSearchLevel + " " + (this.deepSearchLevel < eDeepSearch.HARD ? "true" : "false") );
						
						this.runSolver = false;
						this.OnFailedCallback();
					}
					else 
					{
						if ( (this.deepSearchLevel == eDeepSearch.EASY && this.nestedLevelID > 3 ) 
							|| ( this.deepSearchLevel == eDeepSearch.MEDIUM && this.nestedLevelID > 5 ) 
						)
						{
							//if ( this.nestedLevelID > 3 ) 
							{
								console.log("For Simple search. reverting from " + this.nestedLevelID );

								this.runSolver = false;
								this.OnFailedCallback();
								return;
							}

						}


						this.childSolver = new NestedSolver();

						//solver.PrintPotential("before clone potential");

						this.solver.Print("before clone at nested:" + this.nestedLevelID + " (" + this.currentIndex + "/" + this.solutions.length + ")");
						console.log( "New try with this.nestedLevelID: " + this.nestedLevelID + " r:" + 
							this.solutions[this.currentIndex].r + " c:" +  this.solutions[this.currentIndex].c + " value:" + this.solutions[this.currentIndex].value  );

						if ( this.solutions.length == 0 || this.currentIndex >= this.solutions.length ) 
						{
							console.log("ERROR. " + this.currentIndex + "/" + this.solutions.length );
							this.solver.PrintPotential("before clone potential at nested:" + this.nestedLevelID);
						}

						let clonedSolved = this.solver.Clone();
						clonedSolved.InitClone();

						this.childSolver.Init2 ( clonedSolved, this.solutions[this.currentIndex].r, 
									this.solutions[this.currentIndex].c, this.solutions[this.currentIndex].value, (this.nestedLevelID + 1) );

						this.childSolver.Solve ( this.OnChildSuccess, this.OnChildFailed );


						this.childSolver.solver.Print("after clone at nested:" + this.nestedLevelID);

						this.solver.PrintPotential("before clone potential at nested:" + this.nestedLevelID);
						this.childSolver.solver.PrintPotential("after clone potential at nested:" + this.nestedLevelID);

						this.currentIndex++;
					}
				}

			}
			if ( this.childSolver!= null ) 
				this.childSolver.Update();
		}
	}

	this.OnChildSuccess = function ()
	{
		this.solver = this.childSolver.solver;
	}.bind ( this )

	this.OnChildFailed = function ()
	{
		this.childSolver = null;
	}.bind ( this )


	this.CreateSolutions = function()
	{
		this.currentIndex = 0;
		this.solutions = [];

		this.possibilities = [];

		let max = 0;

		if ( this.deepSearchLevel ==  eDeepSearch.EASY ) 
			max = 3;
		else if ( this.deepSearchLevel == eDeepSearch.MEDIUM ) 
			max = 5;
		else 
			max = MAX_ROWS_COLS;

		for ( count = 2; count < max; count ++ ) 
		{
			for ( r = 0; r < MAX_ROWS_COLS; r++ ) 
			{
				for ( c = 0; c < MAX_ROWS_COLS; c++ )
				{
					this.possibilities = this.solver.GetPossibleSolutions ( r,c );
					if ( this.possibilities.length == count ) 
					{
						for ( poss = 0; poss < this.possibilities.length; poss++ ) 
						{
							this.solutions.push( new Solution ( r, c, this.possibilities[poss] ) );
						}
						//solutions.Add ( new Solution ( r, c, 
					}
				}
			}

		}

	}



	function Solution ( r , c, v ) 
	{
			this.r = r;
			this.c = c;
			this.value = v;
	};

	this.solutions = null;
	this.currentIndex = 0;

	this.runSolver = false;
	this.onCompletedCallback = null;
	this.OnFailedCallback = null;
	this.BASE_ID = 1;
	this.deepSearchLevel = eDeepSearch.EASY;
	this.childSolver = null;

}
