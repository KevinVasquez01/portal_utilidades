namespace ReportingAPI.Models
{
    public class Address
    {
        public object CitySubdivisionName { get; set; }
        public string AddressLine { get; set; }
        public object District { get; set; }
        public string PostalCode { get; set; }
        public object CountryCode { get; set; }
        public string Country { get; set; }
        public string CityCode { get; set; }
        public object City { get; set; }
        public string DepartmentCode { get; set; }
        public object Department { get; set; }
    }

    public class Identification
    {
        public string DocumentNumber { get; set; }
        public string DocumentType { get; set; }
        public string CountryCode { get; set; }
        public string CheckDigit { get; set; }
        public string Code { get; set; }
    }

    public class Person
    {
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string FamilyName { get; set; }
    }

    public class Company
    {
        public string TimezoneCode { get; set; }
        public string RetentionType { get; set; }
        public object ActivitiesDescription { get; set; }
        public object TaxInformation { get; set; }
        public string FinancialSupportEmail { get; set; }
        public object DistributorId { get; set; }
        public string QualificationStatus { get; set; }
        public bool InvoiceIssuingServiceActive { get; set; }
        public string VirtualOperatorId { get; set; }
        public bool PayrollIssuingServiceActive { get; set; }
        public bool SupportDocumentIssuingServiceActive { get; set; }
        public bool InvoiceReceptionServiceActive { get; set; }
        public string Id { get; set; }
        public string Telephone { get; set; }
        public string LegalType { get; set; }
        public Identification Identification { get; set; }
        public object WebsiteUrl { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public Address Address { get; set; }
        public string TaxScheme { get; set; }
        public Person Person { get; set; }
        public object Industry { get; set; }
        public string LanguageCode { get; set; }
        public object ResponsabilityTypes { get; set; }
        public DateTime CreationDate { get; set; }
    }
}
