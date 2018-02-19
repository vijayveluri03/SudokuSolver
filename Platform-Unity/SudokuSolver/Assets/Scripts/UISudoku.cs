using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System.Text;

public class UISudoku : MonoBehaviour 
{
	// Public variables

	public const string BUTTON_SOLVE = "SOLVE";

	public GameObject InputGroupGO;
	public UnityEngine.UI.InputField[] inputField;

	public GameObject loadingGearGO;
	public System.Action<int[,]> callbackOnReady;

	// Public Members

	public void Init ( System.Action<int[,]> callbackOnReady ) 
	{
		this.callbackOnReady = callbackOnReady;
		InputGroupGO.SetActive ( true );


		isInited = true;
	}

	public void SetData ( int[] data ) 
	{
		int count = 0;
		Flush();

		if ( data.Length == Constants.ROWS * Constants.COLS ) 
		{
			for ( int r = 0; r < Constants.ROWS; r++ ) 
			{
				for ( int c = 0; c < Constants.COLS; c++ ) 
				{
					this.data[r,c] = data[count];
					count++;
				}
			}

			Push();
		}
		else 
			QDebug.Assert ( false );

	}


	public void SetReadyToCollectInput ()
	{
		isReadyToCollectInput = true;
	}
	public void Print ( string title ) 
	{
		StringBuilder strb = new StringBuilder();

		strb.Append ( title + "\n" );
		for ( int r = 0; r < Constants.ROWS; r++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ ) 
			{
				strb.Append( data[r,c] > 0 ? data[r,c].ToString() : " " );
				if ( c < (Constants.COLS - 1 ) )
					strb.Append(",");
			}
			strb.Append( "\n" );
		}

		Debug.Log(strb.ToString() );
	}


	public void OnButtonPressed ( string btn ) 
	{
		if ( btn == BUTTON_SOLVE ) 
		{
			if ( !IsReadyToProcess() ) 
			{
				Debug.LogError("Not Ready to process");
				return;
			}
			
			Flush();
			Pull();
			Print( "After solve button is pressed");

			isReadyToCollectInput = false;
			callbackOnReady ( data );
		}
	}


	// Private members

	private void Pull()
	{
		for ( int r = 0; r < Constants.ROWS; r++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ ) 
			{
				int index = r * Constants.ROWS  +  c;
				int value = 0;

				if ( int.TryParse ( inputField[index].text, out value ) ) 
				{
					if ( value >= 1 && value <= 9 )
						data[r,c] = value;
				}
			}
		}
	}

	private void Push ()
	{
		for ( int r = 0; r < Constants.ROWS; r++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ ) 
			{
				int index = r * Constants.ROWS  +  c;
				inputField[index].text = data[r,c].ToString();
			}
		}
	}

	private void Flush ()
	{
		for ( int r = 0; r < Constants.ROWS; r++ ) 
		{
			for ( int c = 0; c < Constants.COLS; c++ ) 
			{
				data[r,c] = 0;
			}
		}
	}

	private bool IsReadyToProcess () 
	{
		return isInited
			&& isReadyToCollectInput;// you can add more to this if needed
	}

	private int[,] data = new int[Constants.ROWS, Constants.COLS];
	private bool isInited = false;
	private bool isReadyToCollectInput = false;
}
