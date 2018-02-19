using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Text;

public class Solver 
{

	// public members 

	public void Init ( int[,] data )
	{
		Debug.Log("Data recieved in solver");
		InitializeData();

		{
			for ( int r = 0; r < Constants.ROWS; r ++ ) 
			{
				for ( int c = 0; c < Constants.COLS; c++ )
				{
					if ( data[r,c] > 0 )
					{
						boxes[r,c].SetValue ( data[r,c] );
						//PrintPotential();
					}
				}
			}
		}
	}

	public void InitClone ()
	{
		runSolver = false;
		isSolvingCompleted = false;
	}

	public void SetValue ( int r, int c, int value ) 
	{
		QDebug.Assert ( !boxes[r,c].IsThisBoxFilled() );
		boxes[r,c].SetValue(value);
	}

	public IList<int> GetPossibleSolutions ( int r, int c ) 
	{
		return boxes[r,c].PossibleSolutions;
	}

	public void Solve (  )
	{
		runSolver = true;
	}

	public bool IsSolvingCompleted () 
	{
		return isSolvingCompleted;
	}

	public bool IsThereAnError ()
	{
		for ( int r = 0; r < Constants.ROWS; r ++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ )
			{
				Box box = boxes[r,c];
				if ( box.IsThisBoxFilled() )
				{
					for ( int i = 0; i < box.OtherBoxesInSameQuad.Count; i++ ) 
					{
						if ( box.Value == GetBoxOfIndex ( box.OtherBoxesInSameQuad[i]).Value ) 
							return true;
					}
					for ( int i = 0; i < box.OtherBoxesInSameCol.Count; i++ ) 
					{
						if ( box.Value == GetBoxOfIndex( box.OtherBoxesInSameCol[i] ).Value ) 
							return true;
					}
					for ( int i = 0; i < box.OtherBoxesInSameRow.Count; i++ ) 
					{
						if ( box.Value == GetBoxOfIndex( box.OtherBoxesInSameRow[i] ).Value ) 
							return true;
					}
				}
				else 
				{
					if ( box.PossibleSolutions.Count == 0 )
						return true;
				}
			}
		}
		return false;
	}

	public bool IsSolvedFully()
	{
		for ( int r = 0; r < Constants.ROWS; r ++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ )
			{
				if ( !boxes[r,c].IsThisBoxFilled() )
				{
					return false;
				}
			}
		}
		return true;
	}

	public void UpdateSolve () 
	{
		if ( runSolver ) 
		{
			bool found = false;
			for ( int r = 0; r < Constants.ROWS; r ++ ) 
			{
				for ( int c = 0; c < Constants.COLS; c++ )
				{
					if ( boxes[r,c].PossibleSolutions.Count == 1 && !boxes[r,c].IsThisBoxFilled() )
					{
						found = true;
						boxes[r,c].SetValue ( boxes[r,c].PossibleSolutions[0] );
					}
				}
			}

//			Print("After a Pass values");
//			PrintPotential("After a pass potential");

			if ( !found ) 
			{
				runSolver = false;
				isSolvingCompleted = true;
			}
		}
	}

	public void Print ( string title) 
	{
		StringBuilder strb = new StringBuilder();


		strb.Append ( title + ":\n" );
		for ( int r = 0; r < Constants.ROWS; r++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ ) 
			{
				strb.Append( string.Format("{0,-3}", boxes[r,c].Value > 0 ? boxes[r,c].Value.ToString() : "_" ) );
//				if ( c < (Constants.COLS - 1 ) )
//					strb.Append(",");
			}
			strb.Append( "\n" );
		}

		Debug.Log(strb.ToString() );
	}

	public void PrintPotential ( string title ) 
	{
		StringBuilder strb = new StringBuilder();

		strb.Append ( title +"\n" );
		for ( int r = 0; r < Constants.ROWS; r++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ ) 
			{
				strb.Append( string.Format("{0,-3}", boxes[r,c].PossibleSolutions.Count.ToString() ) );
//				if ( c < (Constants.COLS - 1 ) )
//					strb.Append(",");
			}
			strb.Append( "\n" );
		}

		Debug.Log(strb.ToString() );
	}


	public Solver Clone () 
	{
		Solver other = new Solver();

		other.boxes = new Box[Constants.ROWS, Constants.COLS];

		for ( int r = 0; r < Constants.ROWS; r ++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ )
			{
				int index = r * Constants.ROWS + c;

				Box clonedBox = boxes[r,c].Clone();
				clonedBox.InitForClone ( other.GetBoxOfIndex );

				other.boxes[r,c] = clonedBox;
				other.boxesArray[ index ] = clonedBox;
			}
		}
		other.runSolver = this.runSolver;
		other.isSolvingCompleted = this.isSolvingCompleted;

		return other;
	}

	// Private members

	// this is a stupid method , we should write better logic
	private void InitializeData ( )
	{
		for ( int r = 0; r < Constants.ROWS; r ++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ )
			{
				int index = r * Constants.ROWS + c;

				int quad = GetQuadrant ( r, c );

				boxes[r,c] = new Box();

				boxesArray [ index ] = boxes[r,c];

				//Debug.Log(r.ToString() + "," + c.ToString() + "->" + quad.ToString());
				boxes[r,c].Init ( r, c,index, quad, GetBoxOfIndex );
			}
		}

		for ( int r = 0; r < Constants.ROWS; r ++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ )
			{
				Box box = boxes[r,c];

				for ( int rOther = 0; rOther < Constants.ROWS; rOther ++ ) 
				{
					for ( int cOther = 0; cOther < Constants.COLS; cOther++ )
					{
						Box boxOther = boxes[rOther,cOther];

						if ( box.Row == boxOther.Row ) 
							box.AddSiblingRowBox ( boxOther );

						if ( box.Col == boxOther.Col ) 
							box.AddSiblingColBox ( boxOther );

						if ( box.Quadrant == boxOther.Quadrant ) 
							box.AddSiblingQuadBox ( boxOther );
					}
				}

				if ( box.OtherBoxesInSameRow.Count != ( Constants.MAX - 1 ) ) 
					Debug.LogError("Something went wrong");

				if ( box.OtherBoxesInSameCol.Count != ( Constants.MAX - 1 ) ) 
					Debug.LogError("Something went wrong");

				if ( box.OtherBoxesInSameQuad.Count != ( Constants.MAX - 1 ) ) 
					Debug.LogError("Something went wrong");
			}
		}
	}

	private int GetQuadrant ( int r, int c ) 
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
				Debug.LogError("Something went wrong");
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
				Debug.LogError("Something went wrong");
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
				Debug.LogError("Something went wrong");
		}
		else 
			Debug.LogError("Something went wrong");
		return -1;

	}


	private Box GetBoxOfIndex ( int index ) 
	{
		return boxesArray[index];
	}

	private Box[,] boxes = new Box[Constants.ROWS, Constants.COLS];
	private Box[] boxesArray = new Box[ Constants.ROWS * Constants.COLS ];
	private bool runSolver = false;
	private bool isSolvingCompleted = false;

}
