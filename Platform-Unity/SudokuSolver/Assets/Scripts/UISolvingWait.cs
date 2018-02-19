using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UISolvingWait : MonoBehaviour 
{
	[SerializeField]
	private GameObject loadingGearGO;

	public void EnableLoadingGear ( bool enable ) 
	{
		loadingGearGO.SetActive ( enable );
	}

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () 
	{
		#if true
		if ( loadingGearGO.activeSelf ) 
		{
			//QDebug.Log("Loading");
		}
		#endif
	}
}
