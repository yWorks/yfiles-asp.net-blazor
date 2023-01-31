using Faker;

namespace yFilesWASM.Hierarchy;

public class Person
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Address { get; set; }

    public Person()
    {
        // Construct a new person with a random name and a random address from Faker.Net.
        this.FirstName = Name.First();
        this.LastName = Name.Last();
        this.Address = $"{Faker.Address.StreetName()}, {Faker.Address.ZipCode()} {Faker.Address.City()}";
    }

    public override string ToString()
    {
        return $"{this.FirstName} {this.LastName}";
    }
}