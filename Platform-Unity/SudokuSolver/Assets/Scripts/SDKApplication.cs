using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SDKApplication : MonoBehaviour 
{

	// Public members

	public void Init () 
	{
		sudokuUi.Init( OnSolveTriggered );

		sudokuUi.SetData ( 

			// fully solvable
//			new int[]
//			{
//				1,0,0,0,6,3,0,0,9,
//				9,0,0,4,2,0,7,0,0,
//				0,4,7,1,0,0,3,8,0,
//
//				0,5,6,0,0,0,0,0,0,
//				0,2,0,0,0,0,0,9,0,
//				0,0,0,0,0,0,6,7,0,
//
//				0,3,4,0,0,9,2,1,0,
//				0,0,1,0,3,6,0,0,7,
//				5,0,0,8,1,0,0,0,3 
//			}
//
//			new int[]
//			{
//				1,0,0,0,6,3,0,0,9,
//				9,0,0,4,2,0,7,0,0,
//				0,4,7,1,0,0,3,8,0,
//
//				0,5,6,0,0,0,0,0,0,
//				0,2,0,0,0,0,0,9,0,
//				0,0,0,0,0,0,6,7,0,
//
//				0,3,4,0,0,9,0,0,0,
//				0,0,1,0,3,6,0,0,0,
//				5,0,0,8,1,0,0,0,0 
//			}

			// moderate
//			new int[]
//			{
//				0,6,2,0,9,0,0,0,0,
//				0,0,1,0,0,0,0,0,0,
//				0,4,9,0,0,1,0,0,0,
//			
//				7,0,3,0,0,9,0,0,1,
//				0,0,8,6,2,3,7,0,0,
//				4,0,0,1,0,0,2,0,8,
//			
//				0,0,0,2,0,0,5,7,0,
//				0,0,0,0,0,0,1,0,0,
//				0,0,0,0,5,0,8,2,0,
//			}


			// very hard 
			new int[]
			{
				0,0,0,0,0,7,0,1,6,
				0,0,0,0,6,0,7,9,3,
				0,0,0,0,0,0,0,0,0,

				0,0,0,0,0,0,0,0,0,
				9,0,0,6,0,1,0,5,0,
				0,0,3,0,0,0,8,2,1,

				0,0,4,0,8,6,0,0,0,
				0,1,5,9,2,0,0,0,0,
				0,0,9,0,4,0,0,0,0,
			}


//			new int[]
//			{
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//			}

//			new int[]
//			{
//				1,2,3,  0,0,0,   0,0,0,
//				4,5,6,  0,0,0,   0,0,0,
//				7,8,9,  0,0,0,   0,0,0,
//
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//				0,0,0,  0,0,0,   0,0,0,
//			}
			// final output 
//
//			1,8,5,7,6,3,4,2,9
//			9,6,3,4,2,8,7,5,1
//			2,4,7,1,9,5,3,8,6
//			7,5,6,9,4,1,8,3,2
//			3,2,8,6,5,7,1,9,4
//			4,1,9,3,8,2,6,7,5
//			6,3,4,5,7,9,2,1,8
//			8,9,1,2,3,6,5,4,7
//			5,7,2,8,1,4,9,6,3

		);

		sudokuUi.SetReadyToCollectInput();
	}


	// Private members

	void OnSolveTriggered ( int[,] data )
	{
		Debug.Log("Recieved Data in Application");

		Solver solver = new Solver();
		solver.Init ( data );

		nestedSolver = new NestedSolver();
		nestedSolver.Init ( solver, 1 );

		nestedSolver.Solve ( OnSolveCompleted, OnSolveFailed );

		EnableLoadingGear( true );
	}

	void OnSolveCompleted ()
	{
//		if ( solver.IsSolvedFully() ) 
//		{
//			EnableLoadingGear ( false );
//			solver.Print("Final Output After the solver is done.");
//		}
//		else 
//		{
//			EnableLoadingGear ( false );
//			QDebug.Log("Solver could not complete fully. We need to use Complex Solver");
//		}

		QDebug.Log("SOLVE completed");

		nestedSolver.Solver.Print( "Final output");

		EnableLoadingGear ( false );
	}
	void OnSolveFailed ()
	{
		QDebug.Log("Solve failed");

		nestedSolver.Solver.Print( "Partial output");

		EnableLoadingGear ( false );

		nestedSolver = null;
	}

	void Start () 
	{
		Init();
	}
	
	void Update () 
	{
		if ( nestedSolver != null )
			nestedSolver.Update();
	}

	private void EnableLoadingGear ( bool enable ) 
	{
		waitUi.EnableLoadingGear ( enable );
	}

	NestedSolver nestedSolver;

	private int[,] inputData;

	[SerializeField] private UISolvingWait waitUi;
	[SerializeField] private UISudoku sudokuUi;


}
