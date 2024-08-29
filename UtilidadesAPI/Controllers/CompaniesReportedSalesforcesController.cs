using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UtilidadesDB_DataAccess.Models;

namespace UtilidadesAPI.Controllers
{
    [Route("UtilidadesAPI/[controller]")]
    [ApiController]
    public class CompaniesReportedSalesforcesController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public CompaniesReportedSalesforcesController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/CompaniesReportedSalesforces
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompaniesReportedSalesforce>>> GetCompaniesReportedSalesforces()
        {
            return await _context.CompaniesReportedSalesforces.ToListAsync();
        }

        // GET: api/CompaniesReportedSalesforces/5 
        [HttpGet("{report_type}")]
        public async Task<ActionResult<List<CompaniesReportedSalesforce>>> GetCompaniesReportedSalesforce(string report_type)
        {
            var companiesReportedSalesforce = await _context.CompaniesReportedSalesforces.Where(x=> x.ReportType.Equals(report_type)).ToListAsync();

            if (companiesReportedSalesforce == null)
            {
                return NotFound();
            }

            return companiesReportedSalesforce;
        }

        // PUT: api/CompaniesReportedSalesforces/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCompaniesReportedSalesforce(int id, CompaniesReportedSalesforce companiesReportedSalesforce)
        {
            if (id != companiesReportedSalesforce.Id)
            {
                return BadRequest();
            }

            _context.Entry(companiesReportedSalesforce).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompaniesReportedSalesforceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/CompaniesReportedSalesforces
        [HttpPost]
        public async Task<ActionResult<CompaniesReportedSalesforce>> PostCompaniesReportedSalesforce(CompaniesReportedSalesforce[] companiesReportedSalesforce)
        {
            for (int i = 0; i < companiesReportedSalesforce.Length; i++)
            {
                _context.CompaniesReportedSalesforces.Add(companiesReportedSalesforce[i]);
            }            
            await _context.SaveChangesAsync();

            return Ok(CreatedAtAction("GetCompaniesReportedSalesforce", new { count = companiesReportedSalesforce.Length }));
        }

        private bool CompaniesReportedSalesforceExists(int id)
        {
            return _context.CompaniesReportedSalesforces.Any(e => e.Id == id);
        }
    }
}
