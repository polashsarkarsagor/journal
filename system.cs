using System;

public class Program
{
    public static void Main()
    {
        Console.Write("Enter data size: ");
        int n = Convert.ToInt32(Console.ReadLine());
        int[] arr = new int[n];

        for (int i = 0; i < n; i++)
        {
            Console.Write("Enter data: ");
            arr[i] = Convert.ToInt32(Console.ReadLine());
        }

        Console.WriteLine("Before Sort the Data set is:");
        for (int i = 0; i < n; i++)
        {
            Console.WriteLine(arr[i]);
        }

        int temp;
        for (int i = 0; i < n - 1; i++)
        {
            for (int j = 0; j < n - 1 - i; j++)
            {
                if (arr[j] > arr[j + 1])
                {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }

        Console.WriteLine("After Sort the Data set is:");
        for (int i = 0; i < n; i++)
        {
            Console.WriteLine(arr[i]);
        }
    }
}
