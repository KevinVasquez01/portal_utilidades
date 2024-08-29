using System;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class Transaction
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string CompanyDocument { get; set; }
        [Required]
        public DateTime? Date { get; set; }
        [Required]
        public string User { get; set; }
        [Required]
        public int TransactionType { get; set; }
        [Required]
        public string Description { get; set; }
    }
}
