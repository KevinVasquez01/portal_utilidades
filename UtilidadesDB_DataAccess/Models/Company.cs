using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class Company
    {
        public Company()
        {
            CompanyContacts = new HashSet<CompanyContact>();
            CompanyDataCreations = new HashSet<CompanyDataCreation>();
            CompanyResponsibilities = new HashSet<CompanyResponsibility>();
            CompanySeries = new HashSet<CompanySeries>();
            CompanyUsers = new HashSet<CompanyUser>();
        } 

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [Required]
        public string DocumentType { get; set; }
        [Required]
        public string CountryCode { get; set; }
        [Required]
        public string DocumentNumber { get; set; }
        public string CheckDigit { get; set; }
        [Required]
        public string LanguageCode { get; set; }
        [Required]
        public string TimezoneCode { get; set; }
        [Required]
        public string TaxScheme { get; set; }
        [Required]
        public string LegalType { get; set; }
        public string FirstName { get; set; }
        public string FamilyName { get; set; }
        public string MiddleName { get; set; }
        public string Name { get; set; }
        public string VirtualOperator { get; set; }
        public string DistributorId { get; set; }
        public string NamePackageOrplan { get; set; }
        [Required]
        public bool PackDefault { get; set; }       
        public virtual ICollection<CompanyContact> CompanyContacts { get; set; }
        public virtual ICollection<CompanyResponsibility> CompanyResponsibilities { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public virtual ICollection<CompanySeries> CompanySeries { get; set; }
        public virtual ICollection<CompanyDataCreation> CompanyDataCreations { get; set; }
        public virtual ICollection<CompanyUser> CompanyUsers { get; set; }
    }
}
