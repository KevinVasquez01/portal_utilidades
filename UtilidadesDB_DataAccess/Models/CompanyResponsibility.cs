using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class CompanyResponsibility
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int IdCompany { get; set; }
        [Required]
        public string ResponsabilityTypes { get; set; }

        public virtual Company IdCompanyNavigation { get; set; }
    }
}
