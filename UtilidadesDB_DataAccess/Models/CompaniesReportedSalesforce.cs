using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class CompaniesReportedSalesforce
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [Required]
        public DateTime DateActivation { get; set; }
        [Required]
        public string DocumentNumber { get; set; }
        [Required]
        public string ReportType { get; set; }
        [Required]
        public string User { get; set; }
    }
}
