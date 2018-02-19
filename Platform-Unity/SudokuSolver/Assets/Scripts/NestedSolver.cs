using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Text;

public enum eDeepSearch
{
	EASY = 1,
	MEDIUM,
	HARD
}

public class NestedSolver 
{
	public int 				ID { get; private set; }
	public Solver 			Solver { get; private set; }


	public void Init ( Solver initialSolver, int id )
	{
		this.Solver = initialSolver;
		ID = id;
		QDebug.Log("in Init ID:" + id);
	}
	public void Init ( Solver initialSolver, int r, int c, int value, int id) 
	{
		this.Solver = initialSolver;
		this.Solver.SetValue ( r, c, value );
		ID = id;
		QDebug.Log("in Init ID:" + id);
	}

	public void Solve ( System.Action onCompletedCallback, System.Action OnFailed ) 
	{
		this.onCompletedCallback = onCompletedCallback;
		this.OnFailedCallback = OnFailed;

		runSolver = true;
		this.Solver.Solve();
	}

	public void Update ()
	{
		if ( runSolver )
		{
			if ( !Solver.IsSolvingCompleted() )
			{
				Solver.UpdateSolve();
				if ( Solver.IsThereAnError() )
				{
					QDebug.LogWarning("<color=yellow>Error occured. reverting " + ID.ToString() + "</color>");
					OnFailedCallback();
				}
			}
			else if ( Solver.IsSolvedFully() )
			{
				onCompletedCallback();
				runSolver = false;
			}
			else
			{
				// its not solved fully 
				// but solver is done 

				if ( solutions == null ) 
				{
					CreateSolutions();
				}

				if ( childSolver == null ) 
				{
					if ( currentIndex>= solutions.Count ) 
					{
						if ( ID == BASE_ID && deepSearchLevel < eDeepSearch.HARD )
						{
							deepSearchLevel++;
							QDebug.LogError("DEEP SEARCH Level Increased. Level :" + deepSearchLevel.ToString());

							currentIndex = 0;
							solutions = null;
							return;
						}

						QDebug.LogWarning("<color=yellow>All iterations completed. reverting " + ID.ToString() + "</color>");
						OnFailedCallback();
					}
					else 
					{
						if ( (deepSearchLevel == eDeepSearch.EASY && ID > 3 ) 
							|| ( deepSearchLevel == eDeepSearch.MEDIUM && ID > 5 ) 
						)
						{
							//if ( ID > 3 ) 
							{
								QDebug.LogWarning("<color=yellow>For Simple search. reverting " + ID.ToString() + "</color>");
								OnFailedCallback();
								return;
							}

						}


						childSolver = new NestedSolver();

						//Solver.PrintPotential("before clone potential");

						Solver.Print("<b>before clone " + ID.ToString() + " (" + currentIndex.ToString() + "/" + solutions.Count.ToString() + ")</b>");
						QDebug.LogWarning( string.Format( "New try with ID:{0} at ( {1}, {2} ) -> {3}", ID, solutions[currentIndex].r, solutions[currentIndex].c, solutions[currentIndex].value ) );

						if ( solutions.Count == 0 || currentIndex>= solutions.Count ) 
						{
							QDebug.LogError("ERROR. " + currentIndex.ToString() + "/" + solutions.Count.ToString() );
							Solver.PrintPotential("before clone potential " + ID.ToString());
						}

						Solver clonedSolved = Solver.Clone();
						clonedSolved.InitClone();

						childSolver.Init ( clonedSolved, solutions[currentIndex].r, solutions[currentIndex].c, solutions[currentIndex].value, (ID + 1) );

						childSolver.Solve ( OnChildSuccess, OnChildFailed );


						childSolver.Solver.Print("after clone " + ID.ToString());

						Solver.PrintPotential("before clone potential " + ID.ToString());
						childSolver.Solver.PrintPotential("after clone potential " + ID.ToString());

						currentIndex++;
					}
				}

			}
			if ( childSolver!= null ) 
				childSolver.Update();
		}
	}

	private void OnChildSuccess ()
	{
		Solver = childSolver.Solver;
	}

	private void OnChildFailed ()
	{
		childSolver = null;
	}


	private void CreateSolutions()
	{
		currentIndex = 0;
		solutions = new List<Solution>();

		IList<int> possibilities = null;

		int max = 0;

		if ( deepSearchLevel ==  eDeepSearch.EASY ) 
			max = 3;
		else if ( deepSearchLevel == eDeepSearch.MEDIUM ) 
			max = 5;
		else 
			max = Constants.ROWS;

		for ( int count = 2; count < max; count ++ ) 
		{
			for ( int r = 0; r < Constants.ROWS; r++ ) 
			{
				for ( int c = 0; c < Constants.COLS; c++ )
				{
					possibilities = Solver.GetPossibleSolutions ( r,c );
					if ( possibilities.Count == count ) 
					{
						for ( int poss = 0; poss < possibilities.Count; poss++ ) 
						{
							solutions.Add( new Solution ( r, c, possibilities[poss] ) );
						}
						//solutions.Add ( new Solution ( r, c, 
					}
				}
			}

		}

	}



	public class Solution
	{
		public Solution ( int r , int c, int v ) 
		{
			this.r = r;
			this.c = c;
			this.value = v;
		}
		public int r;
		public int c;
		public int value;
	};

	private List<Solution> 	solutions;
	private int 			currentIndex;

	private bool 			runSolver = false;
	private System.Action 	onCompletedCallback;
	private System.Action 	OnFailedCallback;
	const int 				BASE_ID = 1;
	private eDeepSearch 	deepSearchLevel = eDeepSearch.EASY;
	private NestedSolver 	childSolver;

}
