namespace yFilesWASM.Hierarchy;

public class Hierarchy {
    public List<Person> People = new List<Person>();
    public List<(Person, Person)> Links = new List<(Person, Person)>();

    public static Hierarchy CreateRandomHierarchy(int count = 20, int degree = 4)
	{
        Random rand = new Random();

        // Clamp the degree.
		degree = Math.Clamp(degree, 1, 7);
		Hierarchy hierarchy = new();

		// Make sure the root is already in the collection.
        Person firstPerson = new();
		hierarchy.People.Add(firstPerson);
		
		// Keep track of the node degrees.
		var degrees = new Dictionary<Person, int>{ { firstPerson, 0 } };

        // Add people and link them to another person.
		for (int i = 1; i < count; i++) {
            // Create the new person.
            Person person = new();

            // Search for somebody else for a link.
			Person parent = hierarchy.People[rand.Next(hierarchy.People.Count)];
			while(degrees[parent] >= degree)
				parent = hierarchy.People[rand.Next(hierarchy.People.Count)];

            // Link them.
			hierarchy.Links.Add((parent, person));

			// Add the new person.
			hierarchy.People.Add(person);
			degrees.Add(person, 1);

            // Increase the degree of the parent.
			degrees[parent]++;
		}
		return hierarchy;
	}
}