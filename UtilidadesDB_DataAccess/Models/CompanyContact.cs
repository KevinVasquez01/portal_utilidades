using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class CompanyContact
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int IdCompany { get; set; }
        [Required]
        public string AddressLine { get; set; }
        [Required]
        public string Country { get; set; }
        [Required]
        public string DepartmentCode { get; set; }
        [Required]
        public string CityCode { get; set; }
        [Required]
        public string PostalCode { get; set; }
        [Required]
        public string FinancialSupportEmail { get; set; }
        [Required]
        public string Email { get; set; }

        public virtual Company IdCompanyNavigation { get; set; }
    }
}
