using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class CompanyUser
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int IdCompany { get; set; }
        public bool IsBlocked { get; set; }
        public string SystemMemberships { get; set; }
        public string VirtualOperatorMemberships { get; set; }
        public string CompanyMemberships { get; set; }
        public string Timezone { get; set; }
        public string LanguageCode { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }

        public virtual Company IdCompanyNavigation { get; set; }
    }
}
