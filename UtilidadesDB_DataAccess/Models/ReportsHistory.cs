using System;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class ReportsHistory
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string User { get; set; }
        [Required]
        public string ReportType { get; set; }
        [Required]
        public string Json { get; set; }
        public decimal? NewCompanies { get; set; }
        public decimal? NewMoney { get; set; }
    }
}
