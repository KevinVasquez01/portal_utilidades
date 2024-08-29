using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class Notification
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public string Round { get; set; }
        [Required]
        public string Icon { get; set; }
        [Required]
        public string Notification1 { get; set; }
        [Required]
        public string Text1 { get; set; }
        [Required]
        public string Text2 { get; set; }
        [Required]
        public string Url { get; set; }
        [Required]
        public string Profile { get; set; }
        [Required]
        public bool Show { get; set; }
    }
}
