using System;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class CompanySeries
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int IdCompany { get; set; }
        public string Name { get; set; }
        public string AuthorizationNumber { get; set; }
        public string Prefix { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public int StartValue { get; set; }
        public int EndValue { get; set; }
        public string EfectiveValue { get; set; }
        public string TechnicalKey { get; set; }
        public string TestSetId { get; set; }

        public virtual Company IdCompanyNavigation { get; set; }
    }
}
