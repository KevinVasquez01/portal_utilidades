using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class HistoryChangesSinco
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [Required]
        public DateTime DateChange { get; set; }
        [Required]
        public string CompanyName { get; set; }
        [Required]
        public string DocumentNumber { get; set; }
        public string Dv { get; set; }
        public string CustomField1 { get; set; }
        public string CustomField2 { get; set; }
        public string CustomField3 { get; set; }
        public string OtherChanges { get; set; }
        [Required]
        public string UserCreator { get; set; }
        [Required]
        public bool IsMacroplantilla { get; set; }
        [Required]
        public bool IsHtml { get; set; }
    }
}
