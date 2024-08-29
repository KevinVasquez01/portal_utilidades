
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class UsersProfile
    {
        [JsonIgnore]
        public int Id { get; set; }
        [Required]
        public string User { get; set; }
        [Required]
        public string Profile { get; set; }
    }
}
