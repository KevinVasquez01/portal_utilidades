using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class DefaultTemplate
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        public string Name { get; set; }
        public string DocumentType { get; set; }
        public string Content { get; set; }
    }
}
