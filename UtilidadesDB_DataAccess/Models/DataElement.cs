using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class DataElement
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        public string Module { get; set; }
        public string Json { get; set; }
    }
}
