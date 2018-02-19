using UnityEngine;
using System.Collections;

public class QDebug
{
    const int printLogsAbovePriority = -1;      // possible options , -1 ( to print all ) , 10 ( to print few ) , 100 ( to print fewer ) ,....

    public static void Assert ( bool condition, string text ="" )
    {
        if ( !condition )
        {
			Debug.LogError( "ASSERT :" + text);
            //Debug.Break();      // breaks execution at the end of the frame. 
            //Debug.Assert(false);

//            FVApplication.instance.m_references.m_popUpManager.ShowHeadsUpText("An error occured", 2);

            return;
        }
    }

    public static void Log(object message, int priority = 0 ) 
	{
        if (priority < printLogsAbovePriority)
            return;
		Debug.Log( message);
	}
    public static void LogWarning (object message)
    {
		Debug.LogWarning( message);
    }
    public static void LogError(object message)
    {
		Debug.LogError( message);

        Assert(false);
    }


    // Todo . needs work on these
    public static void LogPhysics(object message, object message2 = null )
    {
        message = "<color=green>" + message + "</color>";
        if (message2 != null)
            message += (string)message2;
        Log(message);
    }
    public static void LogPhysicsWarning(object message, object message2 = null)
    {
        message = "<color=green>" + message + "</color>";
        if (message2 != null)
            message += (string)message2;
        LogWarning(message);
    }
    public static void LogPhysicsError(object message, object message2 = null)
    {
        message = "<color=green>" + message + "</color>";
        if (message2 != null)
            message += (string)message2;
        LogError(message);
    }


    // Todo . needs work on these
    public static void LogNetwork(object message, object message2 = null)
    {
        message = "<color=blue>" + message + "</color>";
        if (message2 != null)
            message += (string)message2;
        Log(message);
    }
    public static void LogNetworkWarning(object message, object message2 = null)
    {
        message = "<color=blue>" + message + "</color>";
        if (message2 != null)
            message += (string)message2;
        LogWarning(message);
    }
    public static void LogNetworkError(object message, object message2 = null)
    {
        message = "<color=blue>" + message + "</color>";
        if (message2 != null)
            message += (string)message2;
        LogError(message);
    }

    //TESTING PURPOSE
    public static void LogTesting(object message, object message2 = null)
    {
        message = "<color=yellow>" + message + "</color>";
        if (message2 != null)
            message += (string)message2;
        Log(message);
    }
}
