using System;
using System.Text.Json.Serialization;

namespace UtilidadesDB_DataAccess.Models
{
    public partial class CompanyDataCreation
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Id { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int IdCompany { get; set; }
        public DateTime DateCreation { get; set; }
        public bool PayrrollIncluded { get; set; }
        public bool SalesinvoiceIncluded { get; set; }
        public bool DocumentsuportIncluded { get; set; }
        public bool ReceptionSalesinvoiceIncluded { get; set; }

        public bool equivalentDocumentIncluded { get; set; }

        public virtual Company IdCompanyNavigation { get; set; }
    }
}
