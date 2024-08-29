using System;
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
    public class DefaultTemplatesController : ControllerBase
    {
        private readonly UtilidadesContext _context;

        public DefaultTemplatesController(UtilidadesContext context)
        {
            _context = context;
        }

        // GET: api/DefaultTemplates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DefaultTemplate>>> GetDefaultTemplates()
        {
            return await _context.DefaultTemplates.ToListAsync();
        }

        // GET: api/DefaultTemplates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DefaultTemplate>> GetDefaultTemplate(int id)
        {
            var defaultTemplate = await _context.DefaultTemplates.FindAsync(id);

            if (defaultTemplate == null)
            {
                return NotFound();
            }

            return defaultTemplate;
        }

        // PUT: api/DefaultTemplates/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDefaultTemplate(int id, DefaultTemplate defaultTemplate)
        {
            if (id != defaultTemplate.Id)
            {
                return BadRequest();
            }

            _context.Entry(defaultTemplate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DefaultTemplateExists(id))
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

        // POST: api/DefaultTemplates
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DefaultTemplate>> PostDefaultTemplate(DefaultTemplate defaultTemplate)
        {
            _context.DefaultTemplates.Add(defaultTemplate);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDefaultTemplate", new { id = defaultTemplate.Id }, defaultTemplate);
        }

        // DELETE: api/DefaultTemplates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDefaultTemplate(int id)
        {
            var defaultTemplate = await _context.DefaultTemplates.FindAsync(id);
            if (defaultTemplate == null)
            {
                return NotFound();
            }

            _context.DefaultTemplates.Remove(defaultTemplate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DefaultTemplateExists(int id)
        {
            return _context.DefaultTemplates.Any(e => e.Id == id);
        }
    }
}
