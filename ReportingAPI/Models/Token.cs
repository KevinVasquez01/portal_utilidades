namespace ReportingAPI.Models
{
    public class Token
    {
        public string access_token { get; set; }
        public DateTime expires { get; set; }
        public string token_type { get; set; }
        public string virtual_operator_alias { get; set; }
    }
}
