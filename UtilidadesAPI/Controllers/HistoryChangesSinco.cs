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
    public class HistoryChangesSincoController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public HistoryChangesSincoController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/GetHistoryChangesSinco
        [HttpGet]
        [Route("GetHistoryChangesSinco")]
        public async Task<ActionResult<IEnumerable<HistoryChangesSinco>>> GetHistoryChangesSinco()
        {
            return await _context.HistoryChangesSincos.ToListAsync();
        }

        // GET: api/GetHistoryChangesSinco/documentnumber
        [HttpGet]
        [Route("GetHistoryChangesSinco/{documentnumber}")]
        public async Task<ActionResult<IEnumerable<HistoryChangesSinco>>> GetHistoryChangesSinco(string documentnumber)
        {
            var reports = await _context.HistoryChangesSincos.Where(x => x.DocumentNumber == documentnumber).ToListAsync();
            var lastchanges = reports.OrderByDescending(x => x.DateChange).ToList();
            return lastchanges;
        }

        // GET: api/GetHistoryChangesSincoLast
        [HttpGet]
        [Route("GetHistoryChangesSincoLast")]
        public async Task<ActionResult<IEnumerable<HistoryChangesSinco>>> GetHistoryChangesSincoLast()
        {
            var reports = await _context.HistoryChangesSincos.ToListAsync();

            var lastchanges = reports.OrderByDescending(x => x.DateChange).ToList();
            var toreturn = new List<HistoryChangesSinco>();

            foreach (var change in lastchanges)
            {
                if(toreturn.Where(x=> x.DocumentNumber== change.DocumentNumber).ToList().Count == 0)
                {
                    toreturn.Add(change);
                }

                if(toreturn.Count >= 10)
                {
                    break;
                }
            }
            return toreturn;
        }

        // POST: api/ReportsHistory
        [HttpPost]
        public async Task<ActionResult<HistoryChangesSinco>> PostReportsHistory(HistoryChangesSinco changesinco)
        {
            _context.HistoryChangesSincos.Add(changesinco);
            await _context.SaveChangesAsync();

            return Ok(CreatedAtAction("PostReportsHistory", new { id = changesinco.Id }, changesinco.Id));
        }
    }
}