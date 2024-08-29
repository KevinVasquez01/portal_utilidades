using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UtilidadesAPI.Models;
using UtilidadesDB_DataAccess.Models;

namespace UtilidadesAPI.Controllers
{
    [Route("UtilidadesAPI/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public CompaniesController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/Companies
        [HttpGet]
        [Route("GetCompanies")]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
        {
            return await _context.Companies.ToListAsync();
        }

        // GET: api/Transactions
        [HttpGet]
        [Route("GetCompaniesPending")]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompaniesPending()
        {
            var result = (from company in (from c in _context.Companies
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
                                               CompanyContacts = _context.CompanyContacts.Where(x => x.IdCompany == c.Id).ToList(),
                                               CompanyDataCreations = _context.CompanyDataCreations.Where(x => x.IdCompany == c.Id).ToList(),
                                               CompanyResponsibilities = _context.CompanyResponsibilities.Where(x => x.IdCompany == c.Id).ToList(),
                                               CompanySeries = _context.CompanySeries.Where(x => x.IdCompany == c.Id).ToList(),
                                               CompanyUsers = _context.CompanyUsers.Where(x=> x.IdCompany == c.Id).ToList()
                                           }).ToList()
                          join t in _context.Transactions.Where(t => (TransactionTypes)t.TransactionType != TransactionTypes.Update)
                          on (company.DocumentType + "_" + company.DocumentNumber) equals t.CompanyDocument into ct
                          from results in ct.DefaultIfEmpty()
                          where results == null
                          select company
                         ).Where(r => r != null).ToList();

            return result.OrderByDescending(x=> x.Id).ToList();
        }

        // GET: api/Transactions
        [HttpGet]
        [Route("GetCompaniesfrom")]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompaniesfrom(DateTime desde, DateTime hasta)
        {
            var result = await (from c in _context.Companies
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
                         CompanyContacts = _context.CompanyContacts.Where(x => x.IdCompany == c.Id).ToList(),
                         CompanyDataCreations = _context.CompanyDataCreations.Where(x => x.IdCompany == c.Id).ToList(),
                         CompanyResponsibilities = _context.CompanyResponsibilities.Where(x => x.IdCompany == c.Id).ToList(),
                         CompanySeries = _context.CompanySeries.Where(x => x.IdCompany == c.Id).ToList(),
                         CompanyUsers = _context.CompanyUsers.Where(x => x.IdCompany == c.Id).ToList()
                     }).ToListAsync();

            var toReturn = new List<Company>();
            for(int i =0; i< result.Count(); i++)
            {
                if (result[i].CompanyDataCreations.FirstOrDefault().DateCreation >= desde && result[i].CompanyDataCreations.FirstOrDefault().DateCreation <= hasta)
                {
                    toReturn.Add(result[i]);
                }
            }            

            return toReturn;
        }

        // GET: api/Companies/5
        [HttpGet("{documentNumber}")]
        public async Task<ActionResult<IEnumerable<Company>>> GetCompany(string documentNumber)
        {
            var company = await (from c in _context.Companies
                           where (c.DocumentType + '_' + c.DocumentNumber) == documentNumber
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
                               CompanyContacts = _context.CompanyContacts.Where(x => x.IdCompany == c.Id).ToList(),
                               CompanyDataCreations = _context.CompanyDataCreations.Where(x => x.IdCompany == c.Id).ToList(),
                               CompanyResponsibilities = _context.CompanyResponsibilities.Where(x => x.IdCompany == c.Id).ToList(),
                               CompanySeries = _context.CompanySeries.Where(x => x.IdCompany == c.Id).ToList(),
                               CompanyUsers = _context.CompanyUsers.Where(x => x.IdCompany == c.Id).ToList()
                           }).ToListAsync();
            return Ok(company);
        }

        // Update: api/Companies/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCompany(int id, Company company)
        {
            if (!ModelState.IsValid)
            {
                return Conflict(new { message = $"No es un modelo válido" });
            }

            if (id != company.Id)
            {
                return Conflict(new { message = $"No existe la compañía {company.DocumentNumber}." });
            }

            var entityToUpdate = _context.Companies
                                      .Include(a => a.CompanyDataCreations)
                                      .Include(a => a.CompanyContacts)
                                      .Include(a => a.CompanyResponsibilities)
                                      .Include(a => a.CompanySeries)
                                      .Include(a => a.CompanyUsers)
                                      .Single(b => b.Id == id);

            if (entityToUpdate != null)
            {
                try
                {                    
                    entityToUpdate.DocumentType = company.DocumentType;
                    entityToUpdate.CountryCode = company.CountryCode;
                    entityToUpdate.DocumentNumber = company.DocumentNumber;
                    entityToUpdate.CheckDigit = company.CheckDigit;
                    entityToUpdate.LanguageCode = company.LanguageCode;
                    entityToUpdate.TimezoneCode = company.TimezoneCode;
                    entityToUpdate.TaxScheme = company.TaxScheme;
                    entityToUpdate.LegalType = company.LegalType;
                    entityToUpdate.FirstName = company.FirstName;
                    entityToUpdate.FamilyName = company.FamilyName;
                    entityToUpdate.MiddleName = company.MiddleName;
                    entityToUpdate.Name = company.Name;
                    entityToUpdate.VirtualOperator = company.VirtualOperator;
                    entityToUpdate.DistributorId = company.DistributorId;
                    entityToUpdate.NamePackageOrplan = company.NamePackageOrplan;
                    entityToUpdate.PackDefault = company.PackDefault;

                    #region "Modificar CompanyDataCreations"
                    if (company.CompanyDataCreations.Count > 0)
                    {
                        _context.RemoveRange(entityToUpdate.CompanyDataCreations);
                        entityToUpdate.CompanyDataCreations = company.CompanyDataCreations;
                    }                   
                    #endregion                   

                    #region "Modificar CompanyContacts"
                    if (company.CompanyContacts.Count > 0)
                    {
                        _context.RemoveRange(entityToUpdate.CompanyContacts);
                        entityToUpdate.CompanyContacts = company.CompanyContacts;
                    }
                    #endregion

                    #region "Modificar CompanyResponsibilities"
                    if (company.CompanyResponsibilities.Count > 0)
                    {
                        _context.RemoveRange(entityToUpdate.CompanyResponsibilities);
                        entityToUpdate.CompanyResponsibilities = company.CompanyResponsibilities;
                    }
                    #endregion

                    #region "Modificar CompanySeries"
                    if (company.CompanySeries.Count > 0)
                    {
                        _context.RemoveRange(entityToUpdate.CompanySeries);
                        entityToUpdate.CompanySeries = company.CompanySeries;
                    }
                    #endregion

                    #region "Modificar CompanyUsers"
                    if (company.CompanyUsers.Count > 0)
                    {
                        _context.RemoveRange(entityToUpdate.CompanyUsers);
                        entityToUpdate.CompanyUsers = company.CompanyUsers;
                    }
                    #endregion

                    _context.Companies.Update(entityToUpdate);

                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return Conflict(new { message = $"Error {ex}" });
                }

            }
            else
            {
                return Conflict(new { message = $"No existe la compañía {company.DocumentNumber}." });
            }

            return Ok(CreatedAtAction("UpdateCompany", new { id = company.Id }, company.Id));
        }

        // New: api/Companies
        [HttpPost]
        [Route("NewCompany")]
        public async Task<ActionResult<Company>> NewCompany(Company company)
        {
            if (CompanyExistsDocument(company.DocumentType, company.DocumentNumber))
            {
                return Conflict(new { message = $"Ya existe una compañía con el documento {company.DocumentNumber}." });
            }

            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return Ok(CreatedAtAction("GetCompany", new { id = company.Id }, company.Id));
        }

        private bool CompanyExists(int id)
        {
            return _context.Companies.Any(e => e.Id == id);
        }

        private bool CompanyExistsDocument(string DocumentType, string DocumentNumber)
        {
            return _context.Companies.Any(c => c.DocumentType == DocumentType && c.DocumentNumber == DocumentNumber);
        }
    }
}