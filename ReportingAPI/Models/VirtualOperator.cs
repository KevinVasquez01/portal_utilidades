namespace ReportingAPI.Models
{
    public class VirtualOperator
    {
        public string Id { get; set; }
        public string Alias { get; set; }
        public string Email { get; set; }
        public string Telephone { get; set; }
        public string WebsiteUrl { get; set; }
        public string Name { get; set; }
        public string LanguageCode { get; set; }
        public bool CustomizedLoginPageHtmlServiceIsActive { get; set; }
        public object BaseEndpoint { get; set; }
        public bool CompanyCreationServiceActive { get; set; }
    }
}
