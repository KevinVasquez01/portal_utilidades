using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UtilidadesDB_DataAccess.Models;

namespace UtilidadesAPI.Controllers
{
    [Route("UtilidadesAPI/[controller]")]
    [ApiController]
    public class ReportsHistoryController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public ReportsHistoryController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/ReportsHistory
        [HttpGet]
        [Route("GetReportsHistory")]
        public async Task<ActionResult<IEnumerable<ReportsHistory>>> GetReportsHistory()
        {
            return await _context.ReportsHistories.ToListAsync();
        }

        // GET: api/ReportsHistory/5
        [HttpGet]
        [Route("GetReportsHistory/{id}")]
        //[Route("GetReportsHistory")]
        public async Task<ActionResult<ReportsHistory>> GetReportsHistory(int id)
        {
            var reports = await _context.ReportsHistories.FindAsync(id);

            if (reports == null)
            {
                return NotFound();
            }

            return reports;
        }

        // GET: api/ReportsHistory
        [HttpGet]
        [Route("GetReportsHistory_Labels/")]
        public async Task<ActionResult<IEnumerable<ReportsHistory>>> GetReportsHistory_Labels()
        {
            var reports = await _context.ReportsHistories
                .Select(
                history => new ReportsHistory
                {
                    Id = history.Id,
                    Date = history.Date,
                    User = history.User,
                    ReportType = history.ReportType,
                    Json = "",
                    NewCompanies = history.NewCompanies,
                    NewMoney = history.NewMoney
                }).ToListAsync();

            if (reports == null)
            {
                return NotFound();
            }
            return reports;
        }


        // GET: api/ReportsHistory
        [HttpGet]
        [Route("GetReportsHistory_Labels/{reporttype}")]
        public async Task<ActionResult<IEnumerable<ReportsHistory>>> GetReportsHistory_Labels(string reporttype)
        {
            var reports = await _context.ReportsHistories
                .Where(x => x.ReportType == reporttype)
                .Select(
                history => new ReportsHistory
                {
                    Id = history.Id,
                    Date = history.Date,
                    User = history.User,
                    ReportType = history.ReportType,
                    Json = "",
                    NewCompanies = history.NewCompanies,
                    NewMoney = history.NewMoney
                }).ToListAsync();

            if (reports == null)
            {
                return NotFound();
            }

            return reports;
        }

       
        // PUT: api/ReportsHistory/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReportsHistory(int id, ReportsHistory reportHistory)
        {
            if (id != reportHistory.Id)
            {
                return BadRequest();
            }

            _context.Entry(reportHistory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportsHistoryExists(id))
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

        // POST: api/ReportsHistory
        [HttpPost]
        public async Task<ActionResult<ReportsHistory>> PostReportsHistory(ReportsHistory reportHistory)
        {
            _context.ReportsHistories.Add(reportHistory);
            await _context.SaveChangesAsync();

            return Ok(CreatedAtAction("GetCompany", new { id = reportHistory.Id }, reportHistory.Id));
        }

        //DELETE: api/ReportsHistory/DeleteReportsHistory
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReportsHistory(int id)
        {
            var reportHistory = await _context.ReportsHistories.FindAsync(id);
            if (reportHistory == null)
            {
                return NotFound();
            }
            _context.ReportsHistories.Remove(reportHistory);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ReportsHistoryExists(int id)
        {
            return _context.ReportsHistories.Any(e => e.Id == id);
        }
    }
}

