using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class Box 
{
	public int Row 
	{ 
		get; 
		private set; 
	}

	public int Col 
	{ 
		get; 
		private set; 
	}

	public int Index 
	{ 
		get; 
		private set; 
	}

	public int Quadrant 
	{ 
		get; 
		private set; 
	}

	public int Value 
	{ 
		get; 
		private set; 
	}

	public IList<int> OtherBoxesInSameRow
	{
		get 
		{
			return otherBoxesInSameRow.AsReadOnly();
		}
	}
	public IList<int> OtherBoxesInSameCol
	{
		get 
		{
			return otherBoxesInSameCol.AsReadOnly();
		}
	}
	public IList<int> OtherBoxesInSameQuad
	{
		get 
		{
			return otherBoxesInSameQuad.AsReadOnly();
		}
	}

	public IList<int> PossibleSolutions
	{
		get 
		{
			return possibleSolutions.AsReadOnly();
		}
	}


	public void Init ( int r, int c, int index, int quadrant, System.Func<int, Box> getBoxWithIndex )
	{
		Row = r;
		Col = c;
		Index = index;
		Quadrant = quadrant;

		GetBoxWithIndexDelegate = getBoxWithIndex;

		for ( int i = 1; i <= Constants.MAX; i++ ) 
			possibleSolutions.Add ( i );
	}

	public void InitForClone ( System.Func<int, Box> getBoxWithIndex ) 
	{
		GetBoxWithIndexDelegate = getBoxWithIndex;
	}

	public Box Clone () 
	{
		Box other = new Box();

		other.Row = this.Row;
		other.Col = this.Col;
		other.Quadrant = this.Quadrant;
		other.Index = Index;
		other.Value = Value;

		other.GetBoxWithIndexDelegate = null;	// because this is an outside reference

		other.otherBoxesInSameRow = new List<int> ( this.otherBoxesInSameRow );
		other.otherBoxesInSameCol = new List<int> ( this.otherBoxesInSameCol );
		other.otherBoxesInSameQuad = new List<int> ( this.otherBoxesInSameQuad );
		other.possibleSolutions = new List<int> ( this.possibleSolutions );

		return other;
	}





	public void SetValue ( int value ) 
	{
		if ( IsThisBoxFilled() ) 
			Debug.LogError("Something went wrong");

		if ( value <= 0 || value > Constants.MAX ) 
			Debug.LogError ("something went wrong");
		
	
		RemoveAllPossibilities();
	
		this.Value = value;


		RemovePossibilitiesForOthers ( value );
	}

	public void RemoveAllPossibilities ( )
	{
		if ( IsThisBoxFilled () )
			return;
		possibleSolutions.Clear();
	}

	public void RemovePossibility ( int value ) 
	{
		if ( IsThisBoxFilled () )
			return;
		possibleSolutions.Remove ( value );
	}

	public bool IsThisBoxFilled () 
	{
		return Value > 0;
	}


	public void AddSiblingRowBox ( Box box ) 
	{
		if ( box == this ) 
			return;
		if ( otherBoxesInSameRow.Contains ( box.Index ) ) 
			return;
		otherBoxesInSameRow.Add ( box.Index );


	}

	public void AddSiblingColBox ( Box box ) 
	{
		if ( box == this ) 
			return;
		if ( otherBoxesInSameCol.Contains ( box.Index ) ) 
			return;
		otherBoxesInSameCol.Add ( box.Index );
	}

	public void AddSiblingQuadBox ( Box box ) 
	{
		if ( box == this ) 
			return;
		if ( otherBoxesInSameQuad.Contains ( box.Index ) ) 
			return;
		otherBoxesInSameQuad.Add ( box.Index );
	}




	private void RemovePossibilitiesForOthers ( int value )
	{
		for ( int i = 0; i < otherBoxesInSameRow.Count; i++ ) 
		{
			GetBoxWithIndexDelegate( otherBoxesInSameRow[i] ).RemovePossibility ( value );
		}

		for ( int i = 0; i < otherBoxesInSameCol.Count; i++ ) 
		{
			GetBoxWithIndexDelegate( otherBoxesInSameCol[i] ).RemovePossibility ( value );
		}

		for ( int i = 0; i < otherBoxesInSameQuad.Count; i++ ) 
		{
			GetBoxWithIndexDelegate ( otherBoxesInSameQuad[i] ).RemovePossibility ( value );
		}
	}

	private List<int> otherBoxesInSameRow = new List<int>();
	private List<int> otherBoxesInSameCol = new List<int>();
	private List<int> otherBoxesInSameQuad = new List<int>();
	private List<int> possibleSolutions = new List<int>();
	private System.Func<int, Box> GetBoxWithIndexDelegate;
}
