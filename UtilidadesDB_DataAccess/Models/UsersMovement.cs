using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class UsersMovement
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string User { get; set; }
        [Required]
        public string Component { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Ambient { get; set; }
    }
}
