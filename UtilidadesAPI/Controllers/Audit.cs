using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UtilidadesAPI.Models;
using UtilidadesDB_DataAccess.Models;

namespace UtilidadesAPI.Controllers
{
    [Route("UtilidadesAPI/[controller]")]
    [ApiController]
    public class AuditController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public AuditController(UtilidadesContext context)
        {
            _context = context;
        }

        public struct DataTransaction
        {
            public string Distributor { get; set; }
            public string DocumentNumber { get; set; }
            public string Name { get; set; }
            public DateTime Date { get; set; }
            public string Ambients { get; set; }
            public string Action { get; set; }
            public string Services { get; set; }
            public string User { get; set; }
        }

        struct Actions_detail
        {
            public DateTime date { get; set; }
            public string module { get; set; }
            public string message { get; set; }
            public bool status { get; set; }
        }

        struct Actions
        {
            public List<Actions_detail> QA { get; set; }
            public List<Actions_detail> PRD { get; set; }
        }

        string ActionText(TransactionTypes type)
        {
            if(type == TransactionTypes.SentQA)
            {
                return "Compañía enviada a QA";
            }
            else if (type == TransactionTypes.SentPRD)
            {
                return "Compañía enviada a PRD";
            }
            else if (type == TransactionTypes.Delete)
            {
                return "Compañía eliminada";
            }

            return "";
        }

        string ServicesText(CompanyDataCreation dataCreations)
        {
            string services = "";
            if (dataCreations.SalesinvoiceIncluded)
            {
                services += "FE";
            }

            if (dataCreations.DocumentsuportIncluded)
            {
                services += services.Length > 0 ? ";DS": "DS";
            }

            if (dataCreations.PayrrollIncluded)
            {
                services += services.Length > 0 ? ";NE" : "NE";
            }

            if (dataCreations.ReceptionSalesinvoiceIncluded)
            {
                services += services.Length > 0 ? ";RE" : "RE";
            }
            return services;
        }

        string AmbientText(string jsonString)
        {
            string ambients = "";
            try
            {
                var actions = Newtonsoft.Json.JsonConvert.DeserializeObject<Actions>(jsonString);

                if(actions.PRD.Where(x=> x.status).ToList().Count > 0)
                {
                    ambients += ambients.Contains("PRD") ? "" : ambients.Length > 0 ? ";PRD" : "PRD";
                }

                if (actions.QA.Where(x => x.status).ToList().Count > 0)
                {
                    ambients += ambients.Contains("QA") ? "" : ambients.Length > 0 ? ";QA" : "QA";
                }
            }
            catch
            {
                //Old version Log
                try
                {
                    var actions = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Actions_detail>>(jsonString);
                    foreach (var action in actions.Where(x => x.status))
                    {
                        if (action.message.Contains("PRD"))
                        {
                            ambients += ambients.Contains("PRD") ? "" : ambients.Length > 0 ? ";PRD" : "PRD";
                        }
                        else if (action.message.Contains("QA"))
                        {
                            ambients += ambients.Contains("QA") ? "" : ambients.Length > 0 ? ";QA" : "QA";
                        }
                    }
                }
                catch{}
            }
            return ambients;
        }

        // GET: api/CompaniesAuthorized/5
        [HttpGet]
        [Route("GetCompaniesAuthorized")]
        public async Task<ActionResult<IEnumerable<DataTransaction>>> GetCompaniesAuthorized(DateTime desde, DateTime hasta)
        {
            var CompaniesAuthorized = (from c in await (from c in _context.Companies
                                                        select new Company
                                                        {
                                                            Id = c.Id,
                                                            DocumentType = c.DocumentType,
                                                            CountryCode = c.CountryCode,
                                                            DocumentNumber = c.DocumentNumber,
                                                            CheckDigit = c.CheckDigit,
                                                            LanguageCode = c.LanguageCode,
                                                            TimezoneCode = c.TimezoneCode,
                                                            TaxScheme = c.TaxScheme,
                                                            LegalType = c.LegalType,
                                                            FirstName = c.FirstName,
                                                            FamilyName = c.FamilyName,
                                                            MiddleName = c.MiddleName,
                                                            Name = c.Name,
                                                            VirtualOperator = c.VirtualOperator,
                                                            DistributorId = c.DistributorId,
                                                            NamePackageOrplan = c.NamePackageOrplan,
                                                            PackDefault = c.PackDefault,
                                                            CompanyDataCreations = _context.CompanyDataCreations.Where(x => x.IdCompany == c.Id).ToList(),
                                                        }).ToListAsync()
                                       join t in await (from trans in _context.Transactions
                                                        where ((TransactionTypes)trans.TransactionType == TransactionTypes.SentQA
                                                        || (TransactionTypes)trans.TransactionType == TransactionTypes.SentPRD)
                                                        && trans.Date >= desde && trans.Date <= hasta
                                                        select trans).ToListAsync()
                                       on (c.DocumentType + "_" + c.DocumentNumber) equals t.CompanyDocument into ct
                                       from results in ct.DefaultIfEmpty()
                                       where results != default
                                       select new DataTransaction
                                       {
                                           Distributor = c.DistributorId,
                                           DocumentNumber = c.DocumentNumber,
                                           Name = string.IsNullOrEmpty(c.Name) ? string.Format("{0} {1}", c.FirstName, c.FamilyName) : c.Name,
                                           Date = (DateTime)results.Date,
                                           Ambients = AmbientText(results.Description),
                                           Action = ActionText((TransactionTypes)results.TransactionType),
                                           Services = ServicesText(c.CompanyDataCreations.FirstOrDefault()),
                                           User = results.User
                                       }
                         ).ToList();            
            return CompaniesAuthorized;            
        }

        // GET: api/CompaniesDeleted/5
        [HttpGet]
        [Route("GetCompaniesDeleted")]
        public async Task<ActionResult<IEnumerable<DataTransaction>>> GetCompaniesDeleted(DateTime desde, DateTime hasta)
        {
            var CompaniesDeleted = (from c in await (from c in _context.Companies
                                                     select new Company
                                                     {
                                                         Id = c.Id,
                                                         DocumentType = c.DocumentType,
                                                         CountryCode = c.CountryCode,
                                                         DocumentNumber = c.DocumentNumber,
                                                         CheckDigit = c.CheckDigit,
                                                         LanguageCode = c.LanguageCode,
                                                         TimezoneCode = c.TimezoneCode,
                                                         TaxScheme = c.TaxScheme,
                                                         LegalType = c.LegalType,
                                                         FirstName = c.FirstName,
                                                         FamilyName = c.FamilyName,
                                                         MiddleName = c.MiddleName,
                                                         Name = c.Name,
                                                         VirtualOperator = c.VirtualOperator,
                                                         DistributorId = c.DistributorId,
                                                         NamePackageOrplan = c.NamePackageOrplan,
                                                         PackDefault = c.PackDefault,
                                                         CompanyDataCreations = _context.CompanyDataCreations.Where(x => x.IdCompany == c.Id).ToList(),
                                                     }).ToListAsync()
                                    join t in await (from trans in _context.Transactions
                                                     where (TransactionTypes)trans.TransactionType == TransactionTypes.Delete
                                                     && trans.Date >= desde && trans.Date <= hasta
                                                     select trans).ToListAsync()
                                    on (c.DocumentType + "_" + c.DocumentNumber) equals t.CompanyDocument into ct
                                    from results in ct.DefaultIfEmpty()
                                    where results != default
                                    select new DataTransaction
                                    {
                                        Distributor = c.DistributorId,
                                        DocumentNumber = c.DocumentNumber,
                                        Name = string.IsNullOrEmpty(c.Name) ? string.Format("{0} {1}", c.FirstName, c.FamilyName) : c.Name,
                                        Date = (DateTime)results.Date,
                                        Ambients = "",
                                        Action = ActionText((TransactionTypes)results.TransactionType),
                                        Services = ServicesText(c.CompanyDataCreations.FirstOrDefault()),
                                        User = results.User
                                    }
                         ).ToList();
            return CompaniesDeleted;
        }
    }
}